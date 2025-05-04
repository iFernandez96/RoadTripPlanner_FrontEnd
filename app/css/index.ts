import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  main: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  listContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#334155',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    marginRight: 12,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#e2e8f0',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  listItem: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  tripDescription: {
    color: '#475569',
    marginBottom: 8,
  },
  tripInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  tripLocations: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  viewDetailsContainer: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  viewDetailsText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#94a3b8',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#0f172a',
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 4,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#475569',
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  tripDetailHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  tripDetailDates: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  tripDetailLocations: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  tripDetailsScrollView: {
    maxHeight: 400,
  },
  tripDetailSection: {
    marginBottom: 24,
  },
  tripDetailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  tripDetailText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  stopNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontWeight: '600',
  },
  stopName: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  notesText: {
    fontSize: 15,
    color: '#78350f',
    lineHeight: 22,
  },
  friendsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  friendItem: {
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  friendName: {
    color: '#0369a1',
    fontWeight: '500',
  },
  suppliesContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  suppliesText: {
    fontSize: 15,
    color: '#166534',
    lineHeight: 22,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  logoutText: {
    color: '#333',
    fontWeight: '500',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button1: {
    borderRadius: 5,
    padding: 12,
    width: '48%',
    alignItems: 'center'
  },
  cancelButton1: {
    backgroundColor: '#f0f0f0'
  },
  createButton1: {
    backgroundColor: '#0066cc'
  },
  cancelButtonText1: {
    fontWeight: '500',
    color: '#333'
  },
  createButtonText1: {
    fontWeight: '500',
    color: 'white'
  },

  /* New styles for trip options */
  tripHeader: {
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tripOptionsContainer: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 15,
  },
  viewDetailsOption: {
    backgroundColor: '#eff6ff',  // Light blue
    borderColor: '#dbeafe',
  },
  addStintOption: {
    backgroundColor: '#ecfdf5',  // Light green
    borderColor: '#d1fae5',
  },
  addStopsOption: {
    backgroundColor: '#fff7ed',  // Light orange
    borderColor: '#ffedd5',
  },
  addSuppliesOption: {
    backgroundColor: '#f5f3ff',  // Light purple
    borderColor: '#ede9fe',
  },
  headerButtonContainer: {
    flexDirection: 'row',
  },
  refreshButton: {
    backgroundColor: '#10b981',
    marginRight: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '500',
  }
});

export default styles;