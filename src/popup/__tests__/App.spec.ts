import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('Popup App', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(App)
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct title', () => {
    expect(wrapper.text()).toContain('YouTube Overlay Extension')
  })

  it('has correct styling classes', () => {
    expect(wrapper.classes()).toContain('p-4')
    expect(wrapper.classes()).toContain('w-64')
  })

  it('has keyboard shortcut info', () => {
    expect(wrapper.text()).toContain('Press CTRL + F3 to toggle the overlay on YouTube videos.')
  })

  it('shows version number', () => {
    expect(wrapper.text()).toContain('Version: 1.0.0')
  })
}) 