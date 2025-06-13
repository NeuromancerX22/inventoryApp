import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { loadHistory } from '../utils/storage';
import { Card, Paragraph, Avatar, Button, Title } from 'react-native-paper';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function GlobalHistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetch = async () => setHistory(await loadHistory());
    fetch();
  }, []);

  const exportPDF = async () => {
    const html = `
      <html>
        <head><meta charset="utf-8"><title>Histórico Geral</title></head>
        <body>
          <h1>Histórico Geral</h1>
          <ul>
            ${history.map(h => `<li>${new Date(h.date).toLocaleString()} - ${h.name} - Ação: ${h.action}</li>`).join('')}
          </ul>
        </body>
      </html>`;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar Histórico em PDF' });
  };

  const exportCSV = async () => {
    const csvHeader = 'Ação,Nome,Data,Marca,Antes (und.),Depois (und.)\n';
    const csvRows = history.map(h => {
      const date = new Date(h.date).toLocaleString();
      const brand = h.after?.brand || '';
      const beforeQty = h.before?.quantity ?? '';
      const afterQty = h.after?.quantity ?? '';
      return `${h.action},${h.name},${date},${brand},${beforeQty},${afterQty}`;
    });
    const csv = csvHeader + csvRows.join('\n');
    
    const fileUri = FileSystem.documentDirectory + 'historico.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(fileUri);
  };

  const renderEntry = ({ item }) => (
    <Card style={styles.card} elevation={2}>
      <Card.Title
        title={new Date(item.date).toLocaleString()}
        subtitle={`${item.name} - Ação: ${item.action}`}
        left={props => <Avatar.Icon {...props} icon="history" />}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Histórico Geral</Title>
      <Button mode="contained" icon="export" onPress={exportPDF} style={[styles.button, { backgroundColor: '#1553cf' }]}
      >Exportar PDF
      </Button>
      <Button mode="outlined" icon="file-delimited" onPress={exportCSV} style={{ marginBottom: 16 }}>
        Exportar CSV
      </Button>

      <FlatList
        data={history}
        keyExtractor={(r, i) => `${r.id}-${i}`}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { marginBottom: 16, alignSelf: 'center' },
  button: { marginBottom: 16},
  list: { paddingBottom: 16 },
  card: { marginBottom: 12, borderRadius: 8, backgroundColor: '#fff'}
});