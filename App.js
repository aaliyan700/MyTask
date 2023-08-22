import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import Input from './Screens/Input';
import Help from './Screens/Help';
import Display from './Screens/Display';
import Dashboard from './Screens/Dashboard';
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Input"
          component={Input}
          options={{ title: 'Welcome Input Screen' }}
        />
        <Stack.Screen
          name="Display"
          component={Display}
        />
        <Stack.Screen
          name="Help"
          component={Help}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;