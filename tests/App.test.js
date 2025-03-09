import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/popup/App.vue'

describe('App.vue', () => {
  // Mock chrome API
  global.chrome = {
    storage: {
      sync: {
        get: vi.fn(),
        set: vi.fn()
      }
    },
    tabs: {
      query: vi.fn(),
      sendMessage: vi.fn()
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset default mock implementations
    chrome.storage.sync.get.mockImplementation((key, callback) => callback({}));
    chrome.storage.sync.set.mockResolvedValue();
    chrome.tabs.query.mockResolvedValue([{ id: 1 }]);
    chrome.tabs.sendMessage.mockResolvedValue({ success: true });
  });

  it('should load saved text on mount', async () => {
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      callback({ overlayText: 'Saved text' });
    });

    const wrapper = mount(App);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.overlayText).toBe('Saved text');
  });

  it('should show error if loading fails', async () => {
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      throw new Error('Load failed');
    });

    const wrapper = mount(App);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.statusMessage).toBe('Failed to load saved text');
    expect(wrapper.vm.statusClass).toBe('text-red-600');
  });

  it('should save text and update status', async () => {
    const wrapper = mount(App);
    wrapper.vm.overlayText = 'New text';
    
    await wrapper.vm.saveText();
    await wrapper.vm.$nextTick();

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ overlayText: 'New text' });
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
      type: 'updateOverlayText',
      text: 'New text'
    });
    expect(wrapper.vm.statusMessage).toBe('Settings saved successfully!');
    expect(wrapper.vm.statusClass).toBe('text-green-600');
  });

  it('should show error if saving fails', async () => {
    chrome.storage.sync.set.mockRejectedValue(new Error('Save failed'));

    const wrapper = mount(App);
    await wrapper.vm.saveText();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.statusMessage).toBe('Failed to save settings');
    expect(wrapper.vm.statusClass).toBe('text-red-600');
  });

  it('should disable save button while saving', async () => {
    const wrapper = mount(App);
    const savePromise = wrapper.vm.saveText();
    
    expect(wrapper.vm.isSaving).toBe(true);
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    
    await savePromise;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isSaving).toBe(false);
  });

  it('should save on enter key', async () => {
    const wrapper = mount(App);
    const input = wrapper.find('input');
    
    await input.trigger('keyup.enter');
    await wrapper.vm.$nextTick();
    
    expect(chrome.storage.sync.set).toHaveBeenCalled();
  });
}); 