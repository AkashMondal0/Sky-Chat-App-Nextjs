import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


function ResizableWindow({
    children,
    children2,
    toggle
}: {
    children: React.ReactNode
    children2: React.ReactNode
    toggle: "document" | "Both" | "Canvas"
}) {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border w-full"
        >
            {toggle === "Canvas" ? <></> : <ResizablePanel
                collapsible={true}
                minSize={10}
                maxSize={100}
                defaultSize={15}>
                {children2}
            </ResizablePanel>}
            <ResizableHandle withHandle={toggle === "Both" ? true : false} />

            {toggle === "document" ? <></> : <ResizablePanel
                collapsible={true}
                minSize={10}
                maxSize={100}
                defaultSize={50}>
                <ResizablePanelGroup direction="vertical">
                    {children}
                </ResizablePanelGroup>
            </ResizablePanel>}
        </ResizablePanelGroup>
    )
}

export default ResizableWindow;