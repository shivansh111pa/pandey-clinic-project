import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#f43f5e', paddingBottom: 10, marginBottom: 20 },
  headerLeft: { flexDirection: 'column' },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  clinicName: { fontSize: 24, color: '#f43f5e', fontWeight: 'bold' },
  doctorName: { fontSize: 14, fontWeight: 'bold' },
  doctorTitle: { fontSize: 10, color: '#666' },
  patientSection: { marginBottom: 20, backgroundColor: '#fff1f2', padding: 10, borderRadius: 5 },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { fontSize: 10, fontWeight: 'bold', width: 80, color: '#404040' },
  value: { fontSize: 10, color: '#171717' },
  rxSymbol: { fontSize: 32, fontWeight: 'bold', marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#e5e5e5', paddingBottom: 5, marginBottom: 10, marginTop: 15 },
  medRow: { paddingBottom: 8, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  medName: { fontSize: 12, fontWeight: 'bold' },
  medDetails: { fontSize: 10, color: '#525252', marginTop: 3 },
  notes: { fontSize: 10, color: '#404040', marginTop: 5, fontStyle: 'italic' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#a3a3a3', fontSize: 8, borderTopWidth: 1, borderTopColor: '#e5e5e5', paddingTop: 10 },
  signature: { position: 'absolute', bottom: 80, right: 40, borderTopWidth: 1, borderTopColor: '#000', width: 150, textAlign: 'center', paddingTop: 5, fontSize: 10 }
});

export default function PrescriptionPDF({ clinicName, doctorName, patientName, date, diagnosis, medications, notes }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.clinicName}>{clinicName}</Text>
            <Text style={{ fontSize: 10, marginTop: 2 }}>AIIMS Gorakhpur</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.doctorName}>Dr. {doctorName}</Text>
            <Text style={styles.doctorTitle}>MBBS</Text>
            <Text style={{ fontSize: 10, marginTop: 5 }}>Date: {date}</Text>
          </View>
        </View>

        <View style={styles.patientSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>{patientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Diagnosis:</Text>
            <Text style={styles.value}>{diagnosis}</Text>
          </View>
        </View>

        <Text style={styles.rxSymbol}>Rx</Text>

        <View>
          {medications.map((med: any, i: number) => (
            <View key={i} style={styles.medRow}>
              <Text style={styles.medName}>{(i+1)}. {med.name} — {med.dosage}</Text>
              <Text style={styles.medDetails}>Take: {med.frequency} for {med.duration}</Text>
              {med.instructions && <Text style={styles.notes}>Instructions: {med.instructions}</Text>}
            </View>
          ))}
        </View>

        {notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Additional Advice / Notes</Text>
            <Text style={{ fontSize: 10, color: '#404040', lineHeight: 1.5 }}>{notes}</Text>
          </View>
        )}

        <View style={styles.signature}>
          <Text>Signature / Stamp</Text>
        </View>

        <Text style={styles.footer}>
          This is a system generated document. Not valid for medico-legal purposes without physical signature and seal.
        </Text>
      </Page>
    </Document>
  );
}
