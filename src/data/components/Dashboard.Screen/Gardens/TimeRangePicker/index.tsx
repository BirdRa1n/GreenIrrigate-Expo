import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Button, HStack, Center, ButtonText, Spinner, Heading, Text, Toast, useToast, ToastDescription, ToastTitle, VStack } from "@gluestack-ui/themed";
import DatePicker from 'react-native-date-picker'
import api from "../../../../utils/api";

interface TimeRangePickerProps {
    UUID: string;
    closeModal: any;
}

const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
};

export default function TimeRangePicker({ UUID, closeModal }: TimeRangePickerProps) {
    const [startDateTime, setStartDateTime] = useState<Date>();
    const [startDateTimePre, setStartDateTimePre] = useState<Date>(new Date());
    const [endDateTimePre, setEndDateTimePre] = useState<Date>(new Date());

    const [endDateTime, setEndDateTime] = useState<Date>();
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [pickerType, setPickerType] = useState<string>("start");
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [isLoading, setIsloading] = useState(false)

    const [openStart, setOpenStart] = useState(false)
    const [openEnd, setOpenEnd] = useState(false)



    const toast = useToast()


    const handleStartPickerConfirm = (selectedDate: Date) => {
        if (selectedDate) {
            const adjustedDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                selectedDate.getHours(),
                selectedDate.getMinutes() - selectedDate.getTimezoneOffset(),
                0
            );
            setStartDateTimePre(selectedDate);
            setStartDateTime(adjustedDate);
        }
    };

    const handleEndPickerConfirm = (selectedDate: Date) => {
        if (selectedDate) {
            const adjustedDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                selectedDate.getHours(),
                selectedDate.getMinutes() - selectedDate.getTimezoneOffset(),
                0
            );
            setEndDateTimePre(selectedDate);
            setEndDateTime(adjustedDate);
        }
    };

    function createEvent() {
        if (!startDateTime || !endDateTime) {
            return Alert.alert("Ops!", "O evento só pode ser criado, caso o periodo inicial e final seja definido")
        }
        setIsloading(true)
        api
            .post("/app/createEventIrrigation", {
                startTime: startDateTime,
                endTime: endDateTime,
                UUID,
            })
            .then((response) => {
                CreateToast("Muito bem!", "O evento de irrigação foi criado com sucesso!", "success")
                setIsloading(false)
                closeModal()
            })
            .catch((error) => {
                CreateToast("Ops!", "Ocorreu um erro. Tente novamente!", "error")
                console.log(error);
                setIsloading(false)
            });
    }

    const CreateToast = (title: string, description: string, type: string) => {
        toast.show({
            placement: "top",
            render: ({ id }) => {
                return (
                    <Toast action={type || "info"} variant="solid" sx={{ _android: { top: 25 } }}>
                        <VStack space="xs">
                            <ToastTitle>{title}</ToastTitle>
                            <ToastDescription>
                                {description}
                            </ToastDescription>
                        </VStack>
                    </Toast>
                )
            },
        })
    }




    return (
        <View style={{ width: "100%" }}>
            <View
                style={{ width: "100%", alignContent: "center", alignItems: "center" }}
            >
                {showPicker && (
                    <>

                        <DatePicker
                            modal
                            open={openStart}
                            date={startDateTimePre}
                            locale="pt-BR"
                            title={"Selecione a data e hora desejada"}
                            mode="datetime"
                            onConfirm={(date) => {
                                setOpenStart(false)
                                handleStartPickerConfirm(date)
                            }}
                            onCancel={() => {
                                setOpenStart(false)
                            }}
                        />

                        <DatePicker
                            modal
                            open={openEnd}
                            date={endDateTimePre}
                            title={"Selecione a data e hora desejada"}
                            locale="pt-BR"
                            mode="datetime"
                            onConfirm={(date) => {
                                setOpenEnd(false)
                                handleEndPickerConfirm(date)
                            }}
                            onCancel={() => {
                                setOpenEnd(false)
                            }}
                        />
                    </>
                )}
            </View>

            {startDateTime && endDateTime ? <>
                <Heading>Deseja confirmar?</Heading>

                <Text>
                    A irrigação será realizada do dia {startDateTimePre.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} às {startDateTimePre.toLocaleString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })} até {endDateTimePre.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} às {endDateTimePre.toLocaleString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>

                <Button
                    disabled={isLoading}
                    w={"100%"}
                    marginTop={25}
                    variant="outline"
                    action="secondary"
                    marginBottom={10}
                    onPress={() => {
                        createEvent();
                    }}

                >
                    {isLoading ? <Spinner marginRight={5} color={"white"} /> : <></>}
                    <ButtonText>
                        Criar Evento
                    </ButtonText>
                </Button>
            </> : <>
                <Heading>Área de Agendamento</Heading>
                <Text marginBottom={10}>Selecione a data e hora inicial e final para o irrigamento</Text>

                <Center>

                    <HStack space="lg" p={"$1"}>
                        <Button
                            marginTop={10}
                            variant="outline"
                            w={"45%"}
                            h={45}
                            onPress={() => {
                                setShowPicker(true);
                                setPickerType("start");
                                setOpenStart(true)
                            }}
                            marginBottom={1}
                            py="$2.5" action="secondary"
                        >
                            <ButtonText>
                                Data Inicial
                            </ButtonText>
                        </Button>

                        <Button
                            marginTop={10}
                            w={"45%"}
                            h={45}
                            variant="outline"
                            onPress={() => {
                                setShowPicker(true)
                                setOpenEnd(true);
                                setPickerType("end");
                            }}
                            marginBottom={1}
                            py="$2.5" action="secondary"

                        >
                            <ButtonText>
                                Data Final
                            </ButtonText>
                        </Button>
                    </HStack>
                </Center>
            </>}

        </View>
    );
}