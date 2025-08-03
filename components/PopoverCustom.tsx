import {Adapt, Popover, PopoverProps} from "tamagui";
import {ReactNode} from "react";

export default function PopoverCustom({Trigger,children, shouldAdapt, width, height, ...props}: PopoverProps & {
    Trigger: ReactNode;
    children:ReactNode;
    width?: number | string;
    height?: number | string;
    shouldAdapt?: boolean
}) {
    return (
        <Popover size="$5" allowFlip stayInFrame offset={15} resize {...props}>
            <Popover.Trigger asChild>
                {Trigger}
            </Popover.Trigger>

            {shouldAdapt && (
                <Adapt platform="touch">
                    <Popover.Sheet animation="medium" modal dismissOnSnapToBottom>
                        <Popover.Sheet.Frame padding="$4">
                            <Adapt.Contents/>
                        </Popover.Sheet.Frame>
                        <Popover.Sheet.Overlay
                            backgroundColor="$shadowColor"
                            animation="lazy"
                            enterStyle={{opacity: 0.6}}
                            exitStyle={{opacity: 0.6}}
                        />
                    </Popover.Sheet>
                </Adapt>
            )}

            <Popover.Content
                borderWidth={1}
                padding={0}
                borderColor="$borderColor"
                width={width ?? 300}
                height={height ?? 300}
                enterStyle={{y: -10, opacity: 0}}
                exitStyle={{y: -10, opacity: 0}}
                elevate
                animation={[
                    'quick',
                    {
                        opacity: {
                            overshootClamping: true,
                        },
                    },
                ]}
            >
                <Popover.Arrow borderWidth={1} borderColor="$borderColor"/>
                {children}
            </Popover.Content>
        </Popover>
    )
}