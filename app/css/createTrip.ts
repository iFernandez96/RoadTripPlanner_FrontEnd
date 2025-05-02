import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 50
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4a90e2'
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333'
  },
  userInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16
  },
  userInfoText: {
    fontSize: 14,
    color: '#4a90e2',
    fontWeight: '500'
  },
  authenticatedBadge: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 14
  },
  form: {
    width: '100%'
  },
  formGroup: {
    marginBottom: 16
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
    fontWeight: '500'
  },
  subLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
    marginTop: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  listContainer: {
    marginTop: 8,
    paddingLeft: 8
  },
  listItem: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32
  },
  button: {
    borderRadius: 8,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    marginLeft: 8
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 8
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic'
  },
  disabledButton: {
    opacity: 0.7
  },
   dropdownButton: {
      backgroundColor: '#f0f0f0',
      padding: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
      marginBottom: 8,
    },
    dropdownButtonText: {
      fontSize: 16,
      color: '#333',
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    dropdownContainer: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 16,
      width: '90%',
      maxHeight: '80%',
    },
    dropdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    dropdownTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    closeButton: {
      color: '#007bff',
      fontSize: 16,
    },

    // Search input
    searchInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 10,
      marginBottom: 12,
    },

    // User list items
    userItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    userName: {
      fontSize: 16,
      fontWeight: '500',
    },
    userId: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
    },

    // Empty and loading states
    emptyList: {
      padding: 20,
      textAlign: 'center',
      color: '#666',
    },
    centerContent: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      color: '#666',
    },

    // Friend item with remove button
    friendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    removeButton: {
      color: '#ff3b30',
      fontSize: 14,
    },
});