/**
 * Example app stolen from
 * https://github.com/codezri/react-native-todo-firebase
 *
 * @format
 */

import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
} from 'react-native';

const reference = database().ref('/users/Counternames');

const App = () => {
  const [counterNames, setCounterNames] = useState({});
  const counterNameKeys = Object.keys(counterNames);

  const initialList = {
    '-MGQOBLgEvEekOg6geQI': {
      '.value': 'Counter 11',
      '.priority': 4,
    },
    '-MGzzZXdUwpBr8RlLLE-': {
      '.value': 'Counter 22',
      '.priority': 0,
    },
    '-MH3MqLK32gCi0pqBUg3': {
      '.value': 'Counter 33',
      '.priority': 1,
    },
    '-MH3NnGU5iM0eakrd7ZS': {
      '.value': 'Counter 44',
      '.priority': 2,
    },
    '-MH4yucF8rmeewGbPAVI': {
      '.value': 'Counter 55',
      '.priority': 3,
    },
    '-NuBYkNVlAUIUeoQQCKA': {
      '.value': 'Counter 66',
      '.priority': 5,
    },
  };

  useEffect(() => {
    reference.on('value', (snapshot) => {
      let data = snapshot.exportVal();
      console.log(`User data: ${JSON.stringify(data, null, 2)}`);
      var ch = snapshot.child('-MH3NnGU5iM0eakrd7ZS').exportVal();
      console.log(`Counter 44 exportVal ${JSON.stringify(ch)}`);
      let cNames = {};
      snapshot.forEach((ctr) => {
        let p = ctr.getPriority();
        cNames[ctr.key] = { priority: p, value: ctr.val() };

        console.log(
          `Counter priority ${p} has key ${ctr.key}, val ${ctr.val()}`
        );
      });

      setCounterNames(cNames);
    });
  }, []);

  useEffect(() => {
    // initialize
    reference.update(initialList);
  }, []);

  function updatePriorities() {
    const k = Object.keys(initialList);
    k.forEach(
      (key) =>
        (initialList[key]['.priority'] = (Math.random() * 1000).toFixed(0))
    );
    console.log(initialList);
    reference.update(initialList);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <View>
        {counterNameKeys.length > 0 ? (
          counterNameKeys.map((key) => (
            <CounterNameItem
              key={key}
              id={key}
              counterName={counterNames[key]}
            />
          ))
        ) : (
          <Text>No items</Text>
        )}
      </View>

      <View>
        <View style={{ marginTop: 20 }}>
          <Button
            title="Update priorities"
            onPress={updatePriorities}
            color="green"
            disabled={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const CounterNameItem = ({ counterName, id }) => {
  const priority = counterName?.['priority'] ?? 'no priority';
  const value = counterName?.['value'] ?? counterName;
  console.log(counterName, id);
  return (
    <View style={styles.counterName}>
      <Text style={[styles.todoText]}>{priority}</Text>
      <Text style={[styles.todoText]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  contentContainerStyle: {
    padding: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#afafaf',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 20,
    fontSize: 20,
  },
  counterName: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  todoText: {
    paddingHorizontal: 5,
    fontSize: 16,
  },
});

export default App;
