# NsMismatchedButton

一个专为欺骗“肌肉记忆”与“视觉直觉”而设计的按钮组。它通过反转颜色逻辑并强制交换位置，让用户在进行“危险操作”时陷入深深的自我怀疑。

### 组件特性
- **视觉诱导**：故意将代表安全的绿色赋予危险操作（如删除），将代表危险的红色赋予安全操作（如保存）。
- **物理逃逸**：当你犹豫不决地将鼠标滑向任何按钮时，它们会瞬间交换位置，让你永远无法准确点中目标。

<div class="nsui-card" style="margin: 24px 0; display: flex; flex-direction: column; align-items: center; background: #f1f5f9; padding: 40px; border-radius: 24px; gap: 24px;">
  <NsMismatchedButton 
    title="隐私权限请求" 
    subtitle="“Nonsensical UI” 申请访问您的麦克风、摄像头、地理位置、银行卡密码以及您的所有童年回忆。" 
    left-text="全部允许并公开" 
    right-text="拒绝（但允许后台静默访问）" 
  />
</div>

## Props

- `title`: `string`（标题文案）
- `subtitle`: `string`（副标题/说明文案）
- `leftText`: `string`（左侧按钮文案）
- `rightText`: `string`（右侧按钮文案）

## Events

- `left(e)`: 点击左侧按钮
- `right(e)`: 点击右侧按钮
- `swap(swapped)`: 发生位置交换时触发

