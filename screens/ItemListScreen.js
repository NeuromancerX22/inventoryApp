import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Paragraph, Avatar, IconButton, Searchbar } from 'react-native-paper';
import { loadItems, saveItems, addHistory } from '../utils/storage';

export default function ItemListScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetch = async () => setItems(await loadItems());
    const unsubscribe = navigation.addListener('focus', fetch);
    return unsubscribe;
  }, [navigation]);

  const onChangeSearch = text => setQuery(text);
  const filtered = items.filter(it => it.name.toLowerCase().includes(query.toLowerCase()));

  const deleteItem = async id => {
    const target = items.find(it => it.id === id);
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    await saveItems(updated);
    await addHistory({ id, action: 'delete', date: new Date().toISOString(), name: target?.name });
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} elevation={2}>
      <Card.Title
        title={item.name}
        subtitle={`${item.quantity} und.`}
        left={props => <Avatar.Icon {...props} icon="cube" />}
        right={props => (
          <View style={styles.actions}>
            <IconButton {...props} icon="history" onPress={() => navigation.navigate('History', { itemId: item.id })} />
            <IconButton {...props} icon="pencil" onPress={() => navigation.navigate('Form', { item })} />
            <IconButton {...props} icon="delete" onPress={() => deleteItem(item.id)} />
          </View>
        )}
      />
      {item.description ? <Card.Content><Paragraph>{item.description}</Paragraph></Card.Content> : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar item"
        onChangeText={onChangeSearch}
        value={query}
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        label="Adicionar"
        onPress={() => navigation.navigate('Form')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  search: { margin: 16, backgroundColor: '#fff'},
  list: { paddingHorizontal: 16, paddingBottom: 80},
  card: { marginBottom: 12, borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff'},
  actions: { flexDirection: 'row', alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1553cf' }
});