import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Overlay from '../Overlay.vue'

describe('Overlay', () => {
  let wrapper: any

  beforeEach(() => {
    // Create a div for mounting
    const div = document.createElement('div')
    document.body.appendChild(div)
    
    wrapper = mount(Overlay, {
      props: {
        modelValue: false,
        text: 'Test text'
      },
      attachTo: div
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Test text')
  })

  it('has correct default props', () => {
    expect(wrapper.props('modelValue')).toBe(false)
    expect(wrapper.props('text')).toBe('Test text')
  })

  it('shows content when modelValue is true', async () => {
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.isVisible()).toBe(true)
  })

  it('hides content when modelValue is false', async () => {
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('emits update:modelValue event when visibility changes', async () => {
    const event = new KeyboardEvent('keydown', {
      key: 'o',
      ctrlKey: true,
      shiftKey: true
    })
    document.dispatchEvent(event)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
}) 