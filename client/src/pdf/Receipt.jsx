import React from "react";
import { Document, Page, Text, StyleSheet, View, Image } from "@react-pdf/renderer";
import receipt_Top from "../assets/receipt_T.png";
import receipt_Bottom from  "../assets/receipt_B.png";

export default function Receipt({ receiptData }) {
    const {
        contactInfo, country, createdAt, district,
        donationAmount, donorName, paymentMethod,
        sevaName, state, tehsil, temple,
        village, _id
    } = receiptData;

    const styles = StyleSheet.create({
        page: {
            position: 'relative',
            padding: 20,
            zIndex: 1,
        },
        container: {
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #32a1ce",
            borderRadius: "10px",
            marginBottom: "20px",
            position: 'relative',
            zIndex: 1,
        },
        normalContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "5px",
        },
        title: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#4a4a4a',
            textTransform: "uppercase",
        },
        text: {
            fontSize: 12,
            color: '#666',
        },
        logo: {
            width: '120px',
            height: '120px',
            borderRadius: "50%",
            marginBottom: "10px",
        },
        thanksNote: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#32a1ce',
            textAlign: 'center',
            marginTop: '20px',
        },
        topImage: {
            width: '100%',
            height: '25%',
        },
        bottomImage: {
            width: '100%',
            height: '25%',
        },
        bottomHeader : {
            textAlign: 'center',
            color: '#6b6b6a',
            padding: 10,
            fontSize: 10,
        }
    });

    return (
        <Document>
            <Page size={"A4"} style={styles.page}>
                <Image src={receipt_Top} style={styles.topImage} />
                <View style={styles.container} >
                    <View style={styles.normalContainer}>
                        { temple.image && (
                            <Image src={temple.image} style={styles.logo} />
                        ) }
                        <View>
                            <Text style={styles.text}>Receipt Id : { _id } </Text>
                            <Text style={styles.text}>{new Date(createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</Text>
                            <Text style={styles.text}>{temple.name}</Text>
                            <Text style={styles.text}>
                                {`${village}, ${tehsil}, ${district}, ${state}, ${country}`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.normalContainer}>
                        <Text style={styles.title}>Donor Name</Text>
                        <Text style={styles.text}>{donorName}</Text>
                    </View>
                    <View style={styles.normalContainer}>
                        <Text style={styles.title}>Seva Name</Text>
                        <Text style={styles.text}>{sevaName}</Text>
                    </View>
                    <View style={styles.normalContainer}>
                        <Text style={styles.title}>Contact Info</Text>
                        <Text style={styles.text}>{contactInfo}</Text>
                    </View>
                    <View style={styles.normalContainer}>
                        <Text style={styles.title}>Payment Method</Text>
                        <Text style={styles.text}>{paymentMethod}</Text>
                    </View>
                    <View style={styles.normalContainer}>
                        <Text style={styles.title}>Amount</Text>
                        <Text style={styles.text}>
                            { typeof donationAmount === 'number' ? 
                                donationAmount.toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                    style: 'currency',
                                    currency: 'INR'
                            }).slice(1) : ''}
                        </Text>
                    </View>
                    <Text style={styles.thanksNote}>Thank you for your generous donation, {donorName}!</Text>
                </View>
                <Image src={receipt_Bottom} style={styles.bottomImage} />
                <Text style={styles.bottomHeader} fixed>
                    ~ Created By MandirMitra ~
                </Text>
            </Page>
        </Document>
    );
}
