import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventSource from "react-native-sse";

type Lead = {
  full_name: string;
  email: string;
  phone_number: string;
};

export default function HomeScreen() {

  const [leads, setLeads] = useState<Lead[]>([]);
  useEffect(() => {
    fetch("http://192.168.0.103:3000/leads")
      .then(response => response.json())
      .then(data => {
        setLeads(data);
      });
    const eventSource = new EventSource("http://192.168.0.103:3000/events");
    eventSource.addEventListener("message", (event) => {
      if (event.data) {
        const newLead = JSON.parse(event.data);
        setLeads(prev => [...prev, newLead]);
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meta Leads</Text>
        <Text style={styles.subtitle}>
          Live leads received from Meta
        </Text>
      </View>

      <View style={styles.countBox}>
        <Text style={styles.count}>{leads.length}</Text>
        <Text style={styles.countLabel}>Total Leads</Text>
      </View>

      <FlatList
        data={leads}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>NAME</Text>
            <Text style={styles.name}>{item.full_name}</Text>

            <Text style={styles.label}>EMAIL</Text>
            <Text style={styles.detail}>{item.email}</Text>

            <Text style={styles.label}>PHONE</Text>
            <Text style={styles.detail}>{item.phone_number}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#172033",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    color: "#6B7280",
  },

  countBox: {
    backgroundColor: "#4F46E5",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
  },

  count: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  countLabel: {
    fontSize: 13,
    marginTop: 2,
    color: "#E0E7FF",
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 4,
    letterSpacing: 0.8,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#172033",
    marginBottom: 10,
  },

  detail: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 7,
  },
});