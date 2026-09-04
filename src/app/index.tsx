import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventSource from "react-native-sse";

type Lead = {
  name: string;
  email: string;
  phone: string;
};

export default function HomeScreen() {
  
  const [leads , setLeads] = useState<Lead[]>([]);
  useEffect(() =>{
fetch("http://192.168.0.106:3000/leads")
.then(response => response.json())
.then(data => {
  setLeads(data);
});
const eventSource = new EventSource("http://192.168.0.106:3000/events");
eventSource.addEventListener("message", (event) => {
  if (event.data) {
    const newLead = JSON.parse(event.data);
    setLeads(prev => [...prev, newLead]);
  }
});
  }, []);

  return (

    <SafeAreaView>

   <View style={styles.container} >
    <Text>Meta Leads</Text>
    <Text>Leads</Text>

    <FlatList 
    data={leads}
    renderItem={ ({item})=> 
      <View>
      <Text>{item.name}</Text> 
      <Text>{item.email}</Text>
      <Text>{item.phone}</Text>
      </View>
  } >
    </FlatList>
   </View>

  </SafeAreaView>);
  
}

const styles = StyleSheet.create({

 container :
{
  padding: 20
}
 
})
