import { Contact } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContactsListProps {
  contacts: Contact[];
}

export const ContactsList = ({ contacts }: ContactsListProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Latest Contacts</h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center p-2 rounded-lg hover:bg-muted cursor-pointer"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
