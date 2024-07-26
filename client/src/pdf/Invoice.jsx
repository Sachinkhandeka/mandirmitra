import React from "react";
import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: "#f2f2f2",
    },
    header: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
        textTransform: "uppercase",
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: "#444",
        borderBottom: "1px solid #ddd",
        paddingBottom: 5,
        fontWeight: 'bold',
    },
    field: {
        fontWeight: "bold",
        color: "#555",
        fontSize: 10,
    },
    value: {
        marginLeft: 5,
        color: "#333",
        fontSize: 10,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 5,
    },
    horizontalLine: {
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: 1,
        marginVertical: 15,
    },
    statusPaid: {
        color: "#4caf50",
        fontWeight: "bold",
    },
    statusUnpaid: {
        color: "#f44336",
        fontWeight: "bold",
    },
    footer: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 20,
        color: "#555",
    },
    templeStamp: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        borderRadius: "50%",
        backgroundColor: "#b0c4de",
        marginBottom: 10,
    },
    templeStampText: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
    },
    templeInfo: {
        fontSize: 12,
        color: "#777",
        textAlign: "center",
        marginBottom: 20,
    },
    slipTitle: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10,
        color: "#000",
        fontWeight: 'bold',
    },
    roundedBox: {
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    tableCell: {
        margin: 5,
        fontSize: 10,
    },
    bottomHeader : {
        textAlign: 'center',
        color: '#6b6b6a',
        padding: 10,
        fontSize: 10,
    }
});

const getProfileLetters = (fullName) => {
  const slicedParts = fullName.split(' ');
  const firstLetters = slicedParts.map(chunk => chunk.charAt(0));
  return firstLetters.join('');
};

export default function Invoice({ invoiceData }) {
  const {
    address,
    assetType,
    name,
    pincode,
    rentDetails,
    templeId,
  } = invoiceData;

  const tenant = rentDetails?.tenant || {};
  const templeName = templeId?.name || "Temple Name";
  const templeAddress = templeId?.location || "Temple Address";
  const templeInitials = getProfileLetters(templeName);

  return (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Invoice</Text>
        
            <View style={styles.templeStamp}>
                <Text style={styles.templeStampText}>{templeInitials}</Text>
            </View>
            <Text style={styles.header}>{templeName}</Text>
            <Text style={styles.templeInfo}>{templeAddress}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Asset Details</Text>
                <View style={styles.roundedBox}>
                    <View style={styles.row}>
                        <Text style={styles.field}>Asset Name:</Text>
                        <Text style={styles.value}>{name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.field}>Asset Type:</Text>
                        <Text style={styles.value}>{assetType}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.field}>Address:</Text>
                        <Text style={styles.value}>{address}, {pincode}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.horizontalLine} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tenant Details</Text>
                <View style={styles.roundedBox}>
                    <View style={styles.row}>
                        <Text style={styles.field}>Tenant Name:</Text>
                        <Text style={styles.value}>{tenant.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.field}>Contact Info:</Text>
                        <Text style={styles.value}>{tenant.contactInfo}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.field}>Email:</Text>
                        <Text style={styles.value}>{tenant.email}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.field}>Address:</Text>
                        <Text style={styles.value}>{tenant.address}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.horizontalLine} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rent Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Lease Start Date</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Lease End Date</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Rent Amount</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Payment Status</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{new Date(rentDetails.leaseStartDate).toLocaleDateString('en-US')}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{new Date(rentDetails.leaseEndDate).toLocaleDateString('en-US')}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{rentDetails.rentAmount}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                                <Text style={rentDetails.paymentStatus === "Paid" ? styles.statusPaid : styles.statusUnpaid}>
                                    {rentDetails.paymentStatus}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <Text style={styles.footer}>Thank you for your business!</Text>
            <Text style={styles.bottomHeader} fixed>
                ~ Created By MandirMitra ~
            </Text>
        </Page>
    </Document>
  );
}
