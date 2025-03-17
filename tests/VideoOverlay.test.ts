import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import VideoOverlay from '../src/components/VideoOverlay.vue'

describe('VideoOverlay', () => {
  it('renders when visible is true', async () => {
    const wrapper = mount(VideoOverlay)
    const vm = wrapper.vm as any

    await vm.showMessage({
      type: 'showMessage',
      content: 'Test message'
    })

    expect(wrapper.text()).toContain('Test message')
  })

  it('does not render when visible is false', async () => {
    const wrapper = mount(VideoOverlay)
    const vm = wrapper.vm as any

    await vm.showMessage({
      type: 'showMessage',
      content: 'Test message'
    })
    await vm.hideMessage()

    expect(wrapper.text()).toBe('')
  })

  it('shows message with custom style', async () => {
    const wrapper = mount(VideoOverlay)
    const vm = wrapper.vm as any

    await vm.showMessage({
      type: 'showMessage',
      content: 'Test message',
      style: {
        color: 'red',
        fontSize: '32px',
        position: 'middle'
      }
    })

    expect(wrapper.text()).toContain('Test message')
    expect(wrapper.find('.video-overlay').classes()).toContain('middle')
    expect(wrapper.find('.video-overlay').attributes('style')).toContain('color: red')
    expect(wrapper.find('.video-overlay').attributes('style')).toContain('font-size: 32px')
  })

  it('hides message after duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(VideoOverlay)
    const vm = wrapper.vm as any

    await vm.showMessage({
      type: 'showMessage',
      content: 'Test message',
      style: {
        duration: 1000
      }
    })

    expect(wrapper.text()).toContain('Test message')

    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('')

    vi.useRealTimers()
  })
}) 