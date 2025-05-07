# Git 提交规范（Conventional Commits）

本规范适用于 Book Market Kit 项目，所有提交信息需遵循 Conventional Commits 规范（英文优先）。

---

## 提交信息格式

使用规范化的提交信息格式：

```text
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

---

## 提交类型

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码风格修改（不影响代码运行）
- **refactor**: 代码重构（既不是新增功能，也不是修复 bug）
- **perf**: 性能优化
- **test**: 测试相关
- **build**: 构建系统或外部依赖变更
- **ci**: CI 配置文件和脚本变更
- **chore**: 其他不修改 src 或测试文件的变更
- **revert**: 撤销之前的提交

---

## 作用域（可选）

用于说明提交影响的范围：

- **frontend**: 前端代码变更
- **backend**: 后端代码变更
- **api**: API 相关变更
- **ui**: UI 组件变更
- **db**: 数据库相关变更
- **config**: 配置文件变更
- **deps**: 依赖更新

---

## 示例

```text
feat(ui): 添加用户资料页面

- 实现用户基本信息展示
- 添加头像上传功能
- 集成权限控制

Closes #123
```

```text
fix(api): 修复用户认证失败问题

修复了当用户名包含特殊字符时认证失败的问题

Fixes #456
```

---

> 所有生成的提交信息不遵循中文规范，遵循 Conventional Commits 规范，Conventional Commits 是第一优先级。
