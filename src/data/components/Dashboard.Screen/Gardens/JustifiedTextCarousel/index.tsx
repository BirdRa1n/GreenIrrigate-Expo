import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useColorMode } from '@gluestack-style/react';

interface JustifiedTextCarouselProps {
    texts: string[];
}
const screenWidth = Dimensions.get('window').width;


const JustifiedTextCarousel: React.FC<JustifiedTextCarouselProps> = ({ texts }) => {
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const scrollViewRef = useRef<ScrollView | null>(null);

    const colormode = useColorMode()

    const renderTextItem = (text: string, index: number) => (
        <View key={index} style={styles.textContainer}>
            <Text style={{
                fontSize: 16,
                textAlign: 'center',
                color: colormode == "dark" ? "white" : "black"
            }}>{text}</Text>
        </View>
    );


    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const slideIndex = Math.round(
                        event.nativeEvent.contentOffset.x / screenWidth
                    );
                    setActiveSlide(slideIndex);
                }}
            >
                {texts.map((text, index) => renderTextItem(text, index))}
            </ScrollView>
            <View style={styles.paginationContainer}>
                {texts?.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            { backgroundColor: index === activeSlide ? '#171717' : 'gray' },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textContainer: {
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        maxWidth: screenWidth - 50
    },

    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8,
        backgroundColor: 'gray',
    },
});

export default JustifiedTextCarousel;
