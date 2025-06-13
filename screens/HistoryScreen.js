import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { loadHistory } from '../utils/storage';
import { Card, Paragraph, Avatar, Title } from 'react-native-paper';

export default function HistoryScreen({ route }) {
  const [history, setHistory] = useState([]);
  const { itemId } = route.params;

  useEffect(() => {
    const fetch = async () => {
      const all = await loadHistory();
      setHistory(all.filter(r => r.id === itemId));
    };
    fetch();
  }, []);

  const renderEntry = ({ item }) => (
    <Card style={styles.card} elevation={2}>
      <Card.Title
        title={new Date(item.date).toLocaleString()}
        subtitle={`Ação: ${item.action}`}
        left={props => <Avatar.Icon {...props} icon="history" />}
      />
      <Card.Content>
        <Paragraph>Nome: {item.name}</Paragraph>
        {item.before && item.after && (
          <>
            <Paragraph>Antes: {item.before.quantity} und.</Paragraph>
            <Paragraph>Depois: {item.after.quantity} und.</Paragraph>
          </>
        )}
      </Card.Content>
      
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Histórico do Item</Title>
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
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 16 },
  title: { marginBottom: 16, alignSelf: 'center' },
  list: { paddingBottom: 16 },
  card: { marginBottom: 12, borderRadius: 8, backgroundColor: '#fff' }
});