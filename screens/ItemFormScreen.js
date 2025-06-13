import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import uuid from 'react-native-uuid';
import { loadItems, saveItems, addHistory } from '../utils/storage';

export default function ItemFormScreen({ route, navigation }) {
  const editing = !!route.params?.item;
  const [name, setName] = useState(route.params?.item?.name || '');
  const [quantity, setQuantity] = useState(String(route.params?.item?.quantity || ''));
  const [description, setDescription] = useState(route.params?.item?.description || '');

  // Animated values for focus
  const nameAnim = useRef(new Animated.Value(0)).current;
  const qtyAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;

  const onFocusAnim = anim => {
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlurAnim = anim => {
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const interpolateStyle = anim => ({
    borderColor: anim.interpolate({ inputRange: [0, 1], outputRange: ['#ccc', '#1553cf'] }),
    borderWidth: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }),
  });

  const save = async () => {
    const items = await loadItems();
    let updated;
    if (editing) {
      updated = items.map(it => {
        if (it.id === route.params.item.id) {
          const changed = { ...it, name, quantity: Number(quantity), description };
          addHistory({ id: it.id, action: 'edit', date: new Date().toISOString(), name: it.name, before: it, after: changed });
          return changed;
        }
        return it;
      });
    } else {
      const newItem = { id: uuid.v4(), name, quantity: Number(quantity), description };
      updated = [newItem, ...items];
      addHistory({ id: newItem.id, action: 'create', date: new Date().toISOString(), name: newItem.name, after: newItem });
    }
    await saveItems(updated);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>{editing ? 'Editar Item' : 'Novo Item'}</Title>

      <Card style={styles.card} elevation={2}>
        <Card.Content>
          <Animated.View style={[styles.inputContainer, interpolateStyle(nameAnim)]}>
            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              onFocus={() => onFocusAnim(nameAnim)}
              onBlur={() => onBlurAnim(nameAnim)}
              style={styles.input}
            />
          </Animated.View>

          <Animated.View style={[styles.inputContainer, interpolateStyle(qtyAnim)]}>
            <TextInput
              label="Quantidade"
              value={quantity}
              keyboardType="numeric"
              onChangeText={setQuantity}
              onFocus={() => onFocusAnim(qtyAnim)}
              onBlur={() => onBlurAnim(qtyAnim)}
              style={styles.input}
            />
          </Animated.View>

          <Animated.View style={[styles.inputContainer, interpolateStyle(descAnim)]}>
            <TextInput
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              onFocus={() => onFocusAnim(descAnim)}
              onBlur={() => onBlurAnim(descAnim)}
              style={[styles.input, { height: 100 }]}
            />
          </Animated.View>

          <Button mode="contained" onPress={save} style={styles.button}>
            {editing ? 'Atualizar' : 'Salvar'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2'
  },
  title: {
    marginBottom: 16,
    alignSelf: 'center'
  },
  card: {
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  inputContainer: {
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: '#fff'
  },
  input: {
    backgroundColor: 'transparent'
  },
  button: {
    marginTop: 8,
    padding: 8
  }
});
