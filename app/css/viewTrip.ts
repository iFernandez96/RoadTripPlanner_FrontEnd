import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0f172a',
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#475569',
    fontSize: 15,
  },
  valueText: {
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  subLabel: {
    fontWeight: '500',
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flex: 1,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    marginRight: 12,
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
  listContainer: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
});