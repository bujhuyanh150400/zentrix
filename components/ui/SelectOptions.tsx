import {ReactNode, useState} from 'react'
import {Sheet, ScrollView, Paragraph} from 'tamagui'
import {TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";

type OptionType = {
    label: string,
    value: string
}

type SelectOptionsProps = {
    options: OptionType[]
    value: string
    onChange: (value: string) => void
    snapPoints?: number[],
    trigger: (selectedLabel: string) => ReactNode;
}

const SelectOptions = ({
                           options,
                           value,
                           onChange,
                           snapPoints = [80],
                           trigger
                       }: SelectOptionsProps) => {
    const [open, setOpen] = useState(false)

    const selectedLabel = options.find(opt => opt.value === value)?.label
    return (
        <>
            <TouchableWithoutFeedback onPress={() => setOpen(true)}>
                {/* render trigger theo selectedLabel */}
                {trigger(String(selectedLabel))}
            </TouchableWithoutFeedback>

            <Sheet
                modal
                open={open}
                onOpenChange={setOpen}
                snapPoints={snapPoints}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="medium"
                forceRemoveScrollEnabled
            >
                <Sheet.Handle/>
                <Sheet.Frame padding="$4" gap="$3" borderWidth={1} backgroundColor={DefaultColor.white}>
                    <ScrollView>
                        {options.map((opt, idx) => (
                            <TouchableOpacity
                                key={opt.value}
                                onPress={() => {
                                    onChange(opt.value)
                                    setOpen(false)
                                }}
                                style={{
                                    paddingVertical: 10,
                                }}
                            >
                                <Paragraph fontWeight={opt.value === value ? 700 : "normal"}>{opt.label}</Paragraph>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}
export default SelectOptions