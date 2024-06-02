import React from "react";
import { Document, Page, Text, StyleSheet, View, Svg, Path } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fae8af",
        textAlign: "center",
    },
    headingContainer: {
        marginVertical: 20,
    },
    heading: {
        fontSize: 24,
        color: "#f7c326",
        fontWeight: "bold",
        marginBottom: 10,
    },
    inviteQuote: {
        fontSize: 14,
        color: "#444",
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    inviteBody: {
        padding: 20,
    },
    greet: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#bd8018",
    },
    thnksNote: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textAlign: "right",
    },
    horizontalLine: {
        borderBottomColor: "#ffc595",
        borderBottomWidth: 2,
        marginVertical: 10,
    },
    highlight: {
        color: "#bd8018",
    },
    hindiText: {
        fontFamily: "Noto Sans Devanagari, sans-serif",
    },
    passcode: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        color: 'black',
        padding: 5,
        borderRadius: 3,
    },
    outerCircle: {
        position: 'relative',
        width: 160,
        height: 160,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'blue',
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 80,
        borderWidth: 6,
        borderColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    templeNameText: {
        position: 'absolute',
        textAlign: 'center',
        color: 'blue',
    }
});

export default function Invitation({ name, location, date, donor, temple, passCode }) {
    return (
        <Document>
        <Page size="A4" style={styles.container}>
            <View style={styles.passcode}>
                <Text>{passCode ? passCode : "passcode"}</Text>
            </View>
            <View>
                <View style={styles.headingContainer}>
                    <Text style={styles.heading}>{ name }</Text>
                    <Text style={styles.inviteQuote}>
                        "Let’s gather at &nbsp;
                        <Text style={styles.highlight}>{ temple ? temple.name : '____Temple_Name___' }</Text> 
                        &nbsp;to celebrate this sacred event. 
                        Your presence will enrich our festivities."
                    </Text>
                </View>
            </View>
            <View style={styles.inviteBody}>
                <View style={styles.horizontalLine} />
                <View style={styles.greet}>
                    <Text style={styles.highlight}>Dear '{ donor }',</Text>
                </View>
                <View>
                    <Text>
                        We warmly invite you to the event &nbsp; 
                        <Text style={styles.highlight}> 
                            { name }
                        </Text> at &nbsp; 
                        <Text style={styles.highlight}>{ temple ? temple.name : '___Temple_Name' }</Text>. 
                        Join us on &nbsp; 
                        <Text style={styles.highlight}>
                            { date ? new Date(date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: '2-digit',
                                year: 'numeric',
                            }) : 'MM/DD/YY' }
                        </Text>, at &nbsp;<Text style={styles.highlight}>{ location }</Text>,
                        {"\n\n"}
                        Your participation will be deeply appreciated.
                    </Text>
                </View>
                <View style={styles.thnksNote}>
                    <Text>Thank you!</Text>
                </View>
                <View style={styles.horizontalLine} />
            </View>
            <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                    <Text style={styles.templeNameText}>{temple ? temple.name : '__Temple Name__'}</Text>
                </View>
            </View>
        </Page>
    </Document>
    );
}
