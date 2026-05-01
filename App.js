import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, StatusBar,
  Alert, Modal
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Sedang');
  const [taskList, setTaskList] = useState([]);
  const [filter, setFilter] = useState('Semua');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // CRUD: ADD
  const addTask = () => {
    if (task.trim() === '') {
      Alert.alert('Oops!', 'Tuliskan rencana cantikmu dulu ya! ✨');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      text: task.trim(),
      completed: false,
      priority: priority,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setTaskList([newTask, ...taskList]);
    setTask('');
  };

  // CRUD: DELETE
  const deleteTask = (id) => {
    setTaskList(taskList.filter(item => item.id !== id));
  };

  // CRUD: UPDATE (EDIT)
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    setTaskList(taskList.map(item => 
      item.id === editingId ? { ...item, text: editText } : item
    ));
    setEditingId(null);
  };

  // MARK AS DONE
  const toggleComplete = (id) => {
    setTaskList(taskList.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // FILTER LOGIC
  const filteredTasks = taskList.filter(item => {
    if (filter === 'Aktif') return !item.completed;
    if (filter === 'Selesai') return item.completed;
    return true;
  });

  const completedCount = taskList.filter(t => t.completed).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF0F5" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* HEADER & COUNTER */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>MyTaskList ✨</Text>
          <View style={styles.statCard}>
            <Text style={styles.statText}>
              {completedCount} dari {taskList.length} tugas selesai
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: taskList.length > 0 ? `${(completedCount/taskList.length)*100}%` : '0%' }]} />
            </View>
          </View>
        </View>

        {/* INPUT SECTION */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Ada rencana apa hari ini?"
            placeholderTextColor="#DB7093"
            value={task}
            onChangeText={setTask}
          />
          <View style={styles.priorityContainer}>
            {['Tinggi', 'Sedang', 'Rendah'].map((p) => (
              <TouchableOpacity 
                key={p} 
                onPress={() => setPriority(p)}
                style={[styles.pBtn, priority === p && styles.pBtnActive]}
              >
                <Text style={[styles.pBtnText, priority === p && styles.pBtnTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Simpan Tugas</Text>
          </TouchableOpacity>
        </View>

        {/* FILTER TAB */}
        <View style={styles.filterTab}>
          {['Semua', 'Aktif', 'Selesai'].map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={filter === f && styles.filterActive}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DYNAMIC LIST */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={[styles.card, item.completed && styles.cardDone]}>
              <TouchableOpacity style={styles.checkArea} onPress={() => toggleComplete(item.id)}>
                <View style={[styles.circle, item.completed && styles.circleChecked]}>
                  {item.completed && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <View style={styles.cardMain}>
                <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>{item.text}</Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: item.priority === 'Tinggi' ? '#FF1493' : item.priority === 'Sedang' ? '#FFB6C1' : '#F5F5F5' }]}>
                    <Text style={[styles.priorityText, { color: item.priority === 'Rendah' ? '#666' : '#FFF' }]}>{item.priority}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => startEdit(item)} style={styles.iconBtn}><Text>✏️</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.iconBtn}><Text>🗑️</Text></TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🌸</Text>
              <Text style={styles.emptyTitle}>Belum ada list nih</Text>
            </View>
          }
        />

        {/* EDIT MODAL */}
        <Modal visible={editingId !== null} transparent animationType="slide">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Ubah Tugas 🌸</Text>
              <TextInput style={styles.editInput} value={editText} onChangeText={setEditText} />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setEditingId(null)} style={styles.cancelBtn}><Text>Batal</Text></TouchableOpacity>
                <TouchableOpacity onPress={saveEdit} style={styles.saveBtn}><Text style={{color: '#FFF', fontWeight: 'bold'}}>Simpan</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF0F5' },
  container: { flex: 1 },
  header: { padding: 25, backgroundColor: '#FFF0F5' },
  appTitle: { fontSize: 32, fontWeight: '900', color: '#DB7093', letterSpacing: -1 },
  statCard: { marginTop: 15, backgroundColor: '#FFF', padding: 15, borderRadius: 20, elevation: 2 },
  statText: { fontSize: 13, color: '#DB7093', fontWeight: 'bold', marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: '#FFE4E1', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FF69B4' },
  inputSection: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  input: { backgroundColor: '#FFF0F5', padding: 15, borderRadius: 15, color: '#C71585', fontSize: 16 },
  priorityContainer: { flexDirection: 'row', gap: 10, marginTop: 15 },
  pBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#FFB6C1', alignItems: 'center' },
  pBtnActive: { backgroundColor: '#FF69B4', borderColor: '#FF69B4' },
  pBtnText: { color: '#FFB6C1', fontWeight: 'bold', fontSize: 12 },
  pBtnTextActive: { color: '#FFF' },
  addButton: { backgroundColor: '#C71585', padding: 16, borderRadius: 15, marginTop: 15, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  filterTab: { flexDirection: 'row', padding: 20, justifyContent: 'space-around' },
  filterText: { color: '#DB7093', fontWeight: 'bold', fontSize: 14 },
  filterActive: { borderBottomWidth: 3, borderColor: '#C71585', paddingBottom: 4 },
  filterTextActive: { color: '#C71585' },
  listPadding: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 15, flexDirection: 'row', padding: 15, alignItems: 'center', elevation: 2 },
  cardDone: { opacity: 0.6, backgroundColor: '#FDF5F6' },
  checkArea: { marginRight: 15 },
  circle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#FF69B4', justifyContent: 'center', alignItems: 'center' },
  circleChecked: { backgroundColor: '#FF69B4' },
  checkMark: { color: '#FFF', fontWeight: 'bold' },
  cardMain: { flex: 1 },
  taskText: { fontSize: 16, color: '#444', fontWeight: '600' },
  taskTextDone: { textDecorationLine: 'line-through', color: '#B0B0B0' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  timeText: { fontSize: 11, color: '#DB7093' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: 'bold' },
  actionIcons: { flexDirection: 'row', gap: 5 },
  iconBtn: { padding: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: { color: '#DB7093', fontWeight: 'bold', marginTop: 10 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#FFF', width: '85%', padding: 25, borderRadius: 25 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#C71585', marginBottom: 15 },
  editInput: { backgroundColor: '#FFF0F5', padding: 15, borderRadius: 12, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20 },
  saveBtn: { backgroundColor: '#C71585', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  cancelBtn: { paddingVertical: 10 }
});