import React from "react";
import { Document, Page, Text, StyleSheet, View, Image } from "@react-pdf/renderer";
import invitation_Top from "../assets/invitation_Top.png";
import invitation_Bottom from "../assets/invitation_Bottom.png";

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#faf2e9",
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    headingContainer: {
        marginVertical: 20,
    },
    heading: {
        fontSize: 24,
        color: "#b62e56",
        fontWeight: "bold",
        marginBottom: 10,
    },
    inviteQuote: {
        fontSize: 14,
        color: "#b62e56",
        marginBottom: 8,
        paddingHorizontal: 10,
    },
    inviteBody: {
        padding: 20,
        position: "relative",
    },
    greet: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#b62e56",
    },
    thnksNote: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: "bold",
        color: "#b62e56",
        textAlign: "right",
    },
    horizontalLine: {
        borderBottomColor: "#b62e56",
        borderBottomWidth: 2,
        marginVertical: 10,
    },
    highlight: {
        color: "#b62e56",
    },
    hindiText: {
        fontFamily: "Noto Sans Devanagari, sans-serif",
    },
    passcode: {
        backgroundColor: 'white',
        color: 'black',
        padding: 5,
        borderRadius: 3,
        alignSelf: 'flex-end',
        marginBottom: 2,
    },
    outerCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'blue',
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.3,
        zIndex: 0,
        top: "50%", 
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    innerCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 6,
        borderColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    templeNameText: {
        textAlign: 'center',
        color: 'blue',
    },
    imageTop: {
        width: "100%",
        height: "25%",
    },
    imageBottom: {
        width: "100%",
        height: "25%",
    },
});

export default function Invitation({ name, location, date, donor, temple, passCode }) {
    return (
        <Document>
            <Page size="A4" style={styles.container}>
                <Image src={invitation_Top} style={styles.imageTop} />
                <View style={styles.passcode}>
                    <Text>{passCode ? passCode : "passcode"}</Text>
                </View>
                <View>
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>{name}</Text>
                        <Text style={styles.inviteQuote}>
                            "Let’s gather at &nbsp;
                            <Text style={styles.highlight}>{temple ? temple.name : '____Temple_Name___'}</Text>
                            &nbsp;to celebrate this sacred event.
                            Your presence will enrich our festivities."
                        </Text>
                    </View>
                </View>
                <View style={styles.inviteBody}>
                    <View style={styles.horizontalLine} />
                    <View style={styles.outerCircle}>
                        <View style={styles.innerCircle}>
                            <Text style={styles.templeNameText}>{temple ? temple.name : '__Temple Name__'}</Text>
                        </View>
                    </View>
                    <View style={styles.greet}>
                        <Text style={styles.highlight}>Dear '{donor}',</Text>
                    </View>
                    <View>
                        <Text>
                            We warmly invite you to the event &nbsp;
                            <Text style={styles.highlight}>
                                {name}
                            </Text> at &nbsp;
                            <Text style={styles.highlight}>{temple ? temple.name : '___Temple_Name'}</Text>.
                            Join us on &nbsp;
                            <Text style={styles.highlight}>
                                {date ? new Date(date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: '2-digit',
                                    year: 'numeric',
                                }) : 'MM/DD/YY'}
                            </Text>, at &nbsp;<Text style={styles.highlight}>{location}</Text>,
                            {"\n\n"}
                            Your participation will be deeply appreciated.
                        </Text>
                    </View>
                    <View style={styles.thnksNote}>
                        <Text>Thank you!</Text>
                    </View>
                    <View style={styles.horizontalLine} />
                </View>
                <Image src={invitation_Bottom} style={styles.imageBottom} />
            </Page>
        </Document>
    );
}
