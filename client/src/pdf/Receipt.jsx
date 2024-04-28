import React from "react";
import { Document, Page, Text, StyleSheet, View, Image } from "@react-pdf/renderer";

export default function Receipt({ receiptData }) {
    const {
        contactInfo, country, createdAt, district,
        donationAmount, donorName, paymentMethod,
        sevaName, state, tehsil, temple, updatedAt,
        village, _id
    } = receiptData;

    const styles = StyleSheet.create({
        page: {
            backgroundColor: '#f2f2f2',
            padding: 20,
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
    });

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.container} >
                    <View style={styles.normalContainer}>
                        <Image src={temple.image} style={styles.logo} />
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
                </View>
            </Page>
        </Document>
    );
}
