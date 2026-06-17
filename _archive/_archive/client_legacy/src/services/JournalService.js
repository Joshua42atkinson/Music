const STORAGE_KEY = 'conscious_framework_journal';

export const JournalService = {
  getJournal() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  saveReflection(stageId, questionId, reflectionText) {
    const journal = this.getJournal();
    
    if (!journal[stageId]) {
      journal[stageId] = {};
    }
    
    journal[stageId][questionId] = {
      text: reflectionText,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
  },

  getReflection(stageId, questionId) {
    const journal = this.getJournal();
    return journal[stageId]?.[questionId]?.text || '';
  },

  getAllReflections() {
    return this.getJournal();
  },

  clearJournal() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
