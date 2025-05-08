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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
  logoutButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  logoutText: {
    color: '#333',
    fontWeight: '500',
  },
  main: {
    padding: 16,
  },

  profileContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  profileInfo: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    width: '35%',
  },
  infoValue: {
    fontSize: 16,
    color: '#0f172a',
    flex: 1,
  },

  profileForm: {
    marginTop: 8,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
    flex: 1,
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },

  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#f87171',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#64748b',
  },
  avatarName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  avatarEmail: {
    fontSize: 14,
    color: '#64748b',
  }
});

export default styles;