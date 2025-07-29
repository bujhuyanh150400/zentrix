import {ReactNode, useState} from 'react'
import {Sheet, ScrollView, Paragraph} from 'tamagui'
import {TouchableOpacity} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";

type OptionType = {
    label: string,
    unit: ReactNode
    value: string
}

type BottomSheetSelectProps = {
    options: OptionType[]
    value: string
    onChange: (value: string) => void
    snapPoints?: number[]
}

const BottomSheetSelect = ({
                                      options,
                                      value,
                                      onChange,
                                      snapPoints = [80],
                                  }: BottomSheetSelectProps) => {
    const [open, setOpen] = useState(false)

    const selectedLabel = options.find(opt => opt.value === value)?.unit
    return (
        <>
            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={{
                    width: 46,
                    height: 46,
                    alignItems:"center",
                    justifyContent:"center",
                    borderRadius: 10,
                    backgroundColor: DefaultColor.slate[200]
                }}
            >
                <Paragraph>{selectedLabel}</Paragraph>
            </TouchableOpacity>

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
                <Sheet.Handle />
                <Sheet.Frame padding="$4" gap="$3" borderWidth={1}>
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
export default BottomSheetSelect