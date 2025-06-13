import React from 'react';
import { Appbar } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme, IconButton } from 'react-native-paper';
import ItemListScreen from './screens/ItemListScreen';
import { StatusBar } from 'react-native';
import ItemFormScreen from './screens/ItemFormScreen';
import HistoryScreen from './screens/HistoryScreen';
import GlobalHistoryScreen from './screens/GlobalHistoryScreen';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1553cf',
    accent: '#1553cf',
  },
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} /> 
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="List"
          screenOptions={{ headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff' }}
        >
          <Stack.Screen
            name="List"
            component={ItemListScreen}
            options={({ navigation }) => ({
              title: 'Controle de Estoque',
              headerRight: () => (
                <Appbar.Action
                  icon="history"
                  color="#fff"
                  onPress={() => navigation.navigate('GlobalHistory')}
                />
              )
            })}
          />
          <Stack.Screen
            name="Form"
            component={ItemFormScreen}
            options={({ route }) => ({ title: route.params?.item ? 'Editar Item' : 'Novo Item' })}
          />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico Item' }} />
          <Stack.Screen name="GlobalHistory" component={GlobalHistoryScreen} options={{ title: 'Histórico Geral' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    
  );
}