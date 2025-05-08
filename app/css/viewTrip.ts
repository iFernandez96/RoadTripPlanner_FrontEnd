import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 8,
    color: '#0f172a',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
    fontStyle: 'italic',
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

  // New styles for timeline display
  tripSummary: {
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  sectionContainer: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  stintContainer: {
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  stintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  stintTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 2,
  },

  stintDetails: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
    textAlign: 'right',
  },

  stintNotes: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    fontStyle: 'italic',
  },

  mapsButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },

  mapsButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  timelineContainer: {
    marginTop: 8,
  },

  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
    position: 'relative',
    paddingLeft: 4,
  },

  timelineLeg: {
    flexDirection: 'row',
    marginBottom: 12,
    position: 'relative',
    paddingLeft: 20,
    marginLeft: 6,
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    marginRight: 12,
    marginTop: 4,
    zIndex: 2,
  },

  timelineBar: {
    position: 'absolute',
    left: 10,
    width: 2,
    top: -16,
    bottom: -16,
    backgroundColor: '#cbd5e1',
    zIndex: 1,
  },

  timelineContent: {
    flex: 1,
    paddingBottom: 12,
  },

  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },

  timelineLocation: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 2,
    fontWeight: '500',
  },

  timelineTime: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },

  timelineDuration: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },

  timelineLegDetails: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    backgroundColor: '#eef2ff',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#818cf8',
  },

  timelineNotes: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    fontStyle: 'italic',
  },

  loadingText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    padding: 20,
  },

  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    padding: 20,
    marginBottom: 20,
  },
});