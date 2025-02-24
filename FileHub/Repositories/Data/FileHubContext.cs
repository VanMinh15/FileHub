﻿using Application.Entities;
using Application.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using File = Application.Entities.File;

namespace Infrastructure.Data;

public partial class FileHubContext : IdentityDbContext<ApplicationUser>
{
    private readonly IConfiguration _configuration;

    public FileHubContext(DbContextOptions<FileHubContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    public virtual DbSet<File> Files { get; set; }

    public virtual DbSet<Folder> Folders { get; set; }

    public virtual DbSet<ItemTag> ItemTags { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseNpgsql(connectionString);
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<File>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Files_pkey");

            entity.Property(e => e.Id).UseIdentityColumn();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.CreatedAt)
        .HasDatabaseName("IX_Files_CreatedAt");

            entity.Property(e => e.FileType).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Permission).HasMaxLength(20);
            entity.Property(e => e.ReceiverId).HasMaxLength(450);
            entity.Property(e => e.SenderId).HasMaxLength(450);
            entity.Property(e => e.VersionNumber).HasDefaultValue(1);

            entity.HasOne(d => d.Folder).WithMany(p => p.Files)
                .HasForeignKey(d => d.FolderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Files_FolderId_fkey");

            entity.HasOne(d => d.Sender).WithMany(p => p.FileSenders)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Files_SenderId_fkey");

            entity.HasOne(d => d.Receiver).WithMany(p => p.FileReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Files_ReceiverId_fkey");
        });

        modelBuilder.Entity<Folder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Folders_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasIndex(e => e.CreatedAt)
        .HasDatabaseName("IX_Folders_CreatedAt");

            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Permission).HasMaxLength(20);
            entity.Property(e => e.ReceiverId).HasMaxLength(450);
            entity.Property(e => e.SenderId).HasMaxLength(450);

            entity.HasOne(d => d.Sender).WithMany(p => p.FolderSenders)
                    .HasForeignKey(d => d.SenderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Folders_SenderId_fkey");

            entity.HasOne(d => d.Receiver).WithMany(p => p.FolderReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Folders_ReceiverId_fkey");
        });

        modelBuilder.Entity<ItemTag>(entity =>
        {
            entity.HasKey(e => new { e.ItemId, e.TagId }).HasName("ItemTags_pkey");

            entity.Property(e => e.ItemType).HasMaxLength(10);

            entity.HasOne(d => d.Tag).WithMany(p => p.ItemTags)
                .HasForeignKey(d => d.TagId)
                .HasConstraintName("ItemTags_TagId_fkey");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Tags_pkey");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.OwnerId).HasMaxLength(450);

            entity.HasOne(d => d.Owner).WithMany(p => p.Tags)
                               .HasForeignKey(d => d.OwnerId)
                               .OnDelete(DeleteBehavior.ClientSetNull)
                               .HasConstraintName("Tags_OwnerId_fkey");
        });
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
