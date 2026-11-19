@echo off
chcp 65001 >nul

:: 直接硬编码你的项目配置
set "ANTHROPIC_BASE_URL=https://llm.gxx12138.space"
set "ANTHROPIC_AUTH_TOKEN=sk-xbPvNGXewQ6qKP8rz3iHWVuqkVBLyieXx2uq7HetmJeV7F5V"
set "ANTHROPIC_MODEL=gpt-5.6-luna"
set "ANTHROPIC_DEFAULT_HAIKU_MODEL=gpt-5.6-luna"
set "ANTHROPIC_DEFAULT_OPUS_MODEL=gpt-5.6-luna"
set "ANTHROPIC_DEFAULT_SONNET_MODEL=gpt-5.6-luna"
set "ANTHROPIC_REASONING_MODEL=gpt-5.6-luna"
set "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1"
set "CLAUDE_CODE_ATTRIBUTION_HEADER=0"

echo ===== 加载项目 Claude‑Code 环境变量 =====
echo ANTHROPIC_BASE_URL = %ANTHROPIC_BASE_URL%
echo ✅ 项目环境已加载，关闭窗口自动复原
echo ======================================

cmd /k
