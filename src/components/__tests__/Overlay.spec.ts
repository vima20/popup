import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Overlay from '../Overlay.vue'

describe('Overlay', () => {
  let wrapper: any
  let addEventListenerSpy: any
  let removeEventListenerSpy: any

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    wrapper = mount(Overlay, {
      props: {
        isVisible: false
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello world!')
  })

  it('has correct default props', () => {
    expect(wrapper.props().isVisible).toBe(false)
  })

  it('shows content when isVisible is true', async () => {
    await wrapper.setProps({ isVisible: true })
    expect(wrapper.isVisible()).toBe(true)
  })

  it('hides content when isVisible is false', async () => {
    await wrapper.setProps({ isVisible: false })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('has correct styling classes', () => {
    expect(wrapper.classes()).toContain('fixed')
    expect(wrapper.classes()).toContain('inset-0')
    expect(wrapper.classes()).toContain('flex')
    expect(wrapper.classes()).toContain('items-center')
    expect(wrapper.classes()).toContain('justify-center')
    expect(wrapper.classes()).toContain('bg-black')
    expect(wrapper.classes()).toContain('bg-opacity-50')
    expect(wrapper.classes()).toContain('z-50')
  })

  it('emits update:isVisible event when CTRL+F3 is pressed', async () => {
    const mockEvent = new KeyboardEvent('keydown', {
      key: 'F3',
      ctrlKey: true
    })
    
    window.dispatchEvent(mockEvent)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.emitted('update:isVisible')).toBeTruthy()
  })

  it('does not emit update:isVisible event when only F3 is pressed', async () => {
    const mockEvent = new KeyboardEvent('keydown', {
      key: 'F3',
      ctrlKey: false
    })
    
    window.dispatchEvent(mockEvent)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.emitted('update:isVisible')).toBeFalsy()
  })

  it('does not emit update:isVisible event when CTRL+other key is pressed', async () => {
    const mockEvent = new KeyboardEvent('keydown', {
      key: 'F4',
      ctrlKey: true
    })
    
    window.dispatchEvent(mockEvent)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.emitted('update:isVisible')).toBeFalsy()
  })

  it('adds keydown event listener on mount', () => {
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('removes keydown event listener on unmount', () => {
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
}) 