import { Button, clx, Drawer } from "@medusajs/ui";

type DrawerComponentProps = {
    title: string;
    content: any;
    className?: string;
};

export default function DrawerComponent({ title, content, className }: DrawerComponentProps) {
    return (
        <Drawer>
            <Drawer.Trigger asChild>
                <Button className={clx(className)} variant="transparent">
                    {title}
                </Button>
            </Drawer.Trigger>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>{title}</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body className="p-4">{content}</Drawer.Body>
                <Drawer.Footer>
                    <Drawer.Close asChild>
                        <Button variant="secondary">Annulla</Button>
                    </Drawer.Close>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    );
}
