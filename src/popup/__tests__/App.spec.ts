import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  let wrapper: any

  beforeEach(() => {
    // Create a div for mounting
    const div = document.createElement('div')
    document.body.appendChild(div)
    
    wrapper = mount(App, {
      attachTo: div
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('loads text from storage on mount', async () => {
    await wrapper.vm.$nextTick()
    expect(chrome.storage.sync.get).toHaveBeenCalledWith('overlayText')
  })

  it('saves text to storage on change', async () => {
    const input = wrapper.find('input[type="text"]')
    await input.setValue('New text')
    await wrapper.find('button').trigger('click')
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ overlayText: 'New text' })
  })

  it('has correct title', () => {
    expect(wrapper.find('h1').text()).toBe('YouTube Overlay Extension')
  })

  it('has correct styling classes', () => {
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('.bg-white').exists()).toBe(true)
  })

  it('displays keyboard shortcut information', () => {
    expect(wrapper.text()).toContain('CTRL + SHIFT + O')
  })

  it('has custom text input', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('has save button', () => {
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Save')
  })

  it('shows status indicator', async () => {
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.status-indicator').exists()).toBe(true)
  })
}) 