import { Box, HStack, Text } from '@gluestack-ui/themed';
import Markdown from 'react-native-markdown-display';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import FooterVersion from '../../footer/FooterVersion';



const ESPDocs = (): JSX.Element => {
    const [markdownContent, setMarkdownContent] = useState('');

    const fetchMarkdownContent = () => {
        // URL do arquivo Markdown no repositório do GitHub
        const githubUrl = 'https://raw.githubusercontent.com/BirdRa1n/GreenIrrigate/main/esp/esp.md';

        // Fazer uma solicitação HTTP para buscar o conteúdo do arquivo Markdown
        axios.get(githubUrl)
            .then(response => {
                // Definir o conteúdo do Markdown com base na resposta da solicitação
                setMarkdownContent(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar o arquivo Markdown:', error);
            });
    };

    useEffect(() => {
        // Buscar o conteúdo inicial do arquivo Markdown
        fetchMarkdownContent();

        // Configurar o intervalo para buscar o conteúdo a cada 1 segundo
        const intervalId = setInterval(fetchMarkdownContent, 1000);

        // Limpar o intervalo quando o componente for desmontado
        return () => clearInterval(intervalId);
    }, []);


    return (<>
        <Box w={"100%"} h={"100%"} bg='white' p={10}>

            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
            >
                <Markdown>{markdownContent}</Markdown>
            </ScrollView>
            <FooterVersion />
        </Box>


    </>)
}

export default ESPDocs
