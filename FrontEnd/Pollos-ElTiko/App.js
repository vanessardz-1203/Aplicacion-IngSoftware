import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

const icon = require("./assets/logopollos.jpeg")

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={icon} style={{width: 110, height: 100}} />
      <StatusBar style="auto" />
      <Text>Open up App.js to start working on your app!</Text>
      <Text>HOLA CRAYOLA</Text>
      <Text>Jijijiji</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
