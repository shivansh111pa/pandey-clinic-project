import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#f43f5e', paddingBottom: 10, marginBottom: 20 },
  headerLeft: { flexDirection: 'column' },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  logoBox: { backgroundColor: '#f43f5e', padding: '6 10', borderRadius: 4, marginRight: 8, justifyContent: 'center' },
  logoText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  clinicName: { fontSize: 20, color: '#f43f5e', fontWeight: 'bold' },
  doctorName: { fontSize: 14, fontWeight: 'bold' },
  doctorTitle: { fontSize: 10, color: '#666' },
  patientSection: { marginBottom: 20, backgroundColor: '#fff1f2', padding: 10, borderRadius: 5 },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { fontSize: 10, fontWeight: 'bold', width: 80, color: '#404040' },
  value: { fontSize: 10, color: '#171717' },
  rxSymbol: { fontSize: 32, fontWeight: 'bold', marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#e5e5e5', paddingBottom: 5, marginBottom: 10, marginTop: 15 },
  medRow: { paddingBottom: 10, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', backgroundColor: '#fafafa', padding: 8, borderRadius: 4 },
  medName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  medDetailsRow: { flexDirection: 'row', marginTop: 4 },
  medDetailBox: { flex: 1 },
  medDetailLabel: { fontSize: 9, color: '#64748b', fontWeight: 'bold' },
  medDetailValue: { fontSize: 10, color: '#334155', marginTop: 1 },
  notes: { fontSize: 10, color: '#f43f5e', marginTop: 5, fontStyle: 'italic', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#a3a3a3', fontSize: 8, borderTopWidth: 1, borderTopColor: '#e5e5e5', paddingTop: 10 },
  signature: { position: 'absolute', bottom: 80, right: 40, borderTopWidth: 1, borderTopColor: '#000', width: 150, textAlign: 'center', paddingTop: 5, fontSize: 10 }
});

export default function PrescriptionPDF({ clinicName, doctorName, patientName, date, diagnosis, medications, notes }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.logoBox}>
               <Text style={styles.logoText}>PC</Text>
            </View>
            <View style={styles.headerLeft}>
              <Text style={styles.clinicName}>{clinicName}</Text>
              <Text style={{ fontSize: 10, marginTop: 2 }}>AIIMS Gorakhpur</Text>
            </View>
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
              <Text style={styles.medName}>{(i+1)}. Medicine: {med.name} ({med.dosage})</Text>
              
              <View style={styles.medDetailsRow}>
                 <View style={styles.medDetailBox}>
                    <Text style={styles.medDetailLabel}>No. of days:</Text>
                    <Text style={styles.medDetailValue}>{med.duration}</Text>
                 </View>
                 <View style={styles.medDetailBox}>
                    <Text style={styles.medDetailLabel}>Take frequency:</Text>
                    <Text style={styles.medDetailValue}>{med.frequency}</Text>
                 </View>
              </View>

              {med.instructions && <Text style={styles.notes}>Instruction: {med.instructions}</Text>}
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
