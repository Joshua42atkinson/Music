# Voix Vive Documentation

Complete documentation for the Voix Vive guitar masterclass platform.

---

## 📚 Documentation Map

### 🎯 Start Here

| Document | Purpose | Read When... |
|----------|---------|--------------|
| [QUICKSTART_LM_STUDIO.md](./QUICKSTART_LM_STUDIO.md) | 3-minute setup for AI features | You want to start using LM Studio |
| [AI_DEVELOPER_GUIDE.md](./AI_DEVELOPER_GUIDE.md) | Complete AI modification guide | You want Bertrand to fix bugs via chat |

### 📋 Core Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [../CONTEXT.md](../CONTEXT.md) | Master project context | Everyone |
| [../DESIGN.md](../DESIGN.md) | System architecture | Developers |
| [../ROADMAP.md](../ROADMAP.md) | Development timeline | Project managers |
| [../USER_EXPERIENCE_MAP.md](../USER_EXPERIENCE_MAP.md) | User journey | Designers |

### 🔧 Technical Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [API_REFERENCE.md](./API_REFERENCE.md) | Hook & component APIs | Developers |
| [ARCHITECTURE_FLOWS.md](./ARCHITECTURE_FLOWS.md) | Data flows & state | Developers |
| [LM_STUDIO_SETUP.md](./LM_STUDIO_SETUP.md) | LM Studio configuration | DevOps |

### 🤖 AI/Developer Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [AI_DEVELOPER_GUIDE.md](./AI_DEVELOPER_GUIDE.md) | AI modification system | Bertrand, Developers |
| [LM_STUDIO_SETUP.md](./LM_STUDIO_SETUP.md) | LM Studio setup | Developers |
| [QUICKSTART_LM_STUDIO.md](./QUICKSTART_LM_STUDIO.md) | Quick setup | Everyone |
| [../mcp-server/README.md](../mcp-server/README.md) | MCP server details | Developers |

### 📊 Business Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [../MEETING_PREP.md](../MEETING_PREP.md) | Stakeholder meeting notes | Team |
| [../IP_ASSIGNMENT.md](../IP_ASSIGNMENT.md) | IP terms | Legal |
| [../Gamifying Guitar Learning with Open Source.md](../Gamifying%20Guitar%20Learning%20with%20Open%20Source.md) | Academic research | Researchers |

### 🎓 Pedagogy Documentation (in research/)

| Document | Purpose | Audience |
|----------|---------|----------|
| [../research/10_MASTER_DESIGN_DOC.md](../research/10_MASTER_DESIGN_DOC.md) | Platform master doc | Everyone |
| [../research/10_design_doc_01_foundation.md](../research/10_design_doc_01_foundation.md) | Philosophy & mandate | Designers |
| [../research/10_design_doc_02_curriculum.md](../research/10_design_doc_02_curriculum.md) | Curriculum design | Content creators |
| [../research/10_design_doc_03_vertiscale_game.md](../research/10_design_doc_03_vertiscale_game.md) | Game design | Game developers |
| [../research/10_design_doc_04_platform_and_business.md](../research/10_design_doc_04_platform_and_business.md) | Tech & business | Developers |

---

## 🗂️ By Task

### "I want to understand the system"
1. [../CONTEXT.md](../CONTEXT.md) - Get context
2. [../DESIGN.md](../DESIGN.md) - See architecture
3. [../USER_EXPERIENCE_MAP.md](../USER_EXPERIENCE_MAP.md) - Understand users

### "I want to write code"
1. [API_REFERENCE.md](./API_REFERENCE.md) - See available APIs
2. [ARCHITECTURE_FLOWS.md](./ARCHITECTURE_FLOWS.md) - Understand data flow
3. [../DESIGN.md](../DESIGN.md) - Review architecture

### "I want to set up LM Studio"
1. [QUICKSTART_LM_STUDIO.md](./QUICKSTART_LM_STUDIO.md) - Quick setup
2. [LM_STUDIO_SETUP.md](./LM_STUDIO_SETUP.md) - Detailed config
3. [AI_DEVELOPER_GUIDE.md](./AI_DEVELOPER_GUIDE.md) - Usage guide

### "I want Bertrand to fix a bug"
1. [QUICKSTART_LM_STUDIO.md](./QUICKSTART_LM_STUDIO.md) - Start servers
2. [AI_DEVELOPER_GUIDE.md](./AI_DEVELOPER_GUIDE.md) - Guide Bertrand
3. Navigate to `/ai-developer` - Start chatting

### "I want to add a game feature"
1. [../research/10_design_doc_03_vertiscale_game.md](../research/10_design_doc_03_vertiscale_game.md) - Game mechanics
2. [ARCHITECTURE_FLOWS.md](./ARCHITECTURE_FLOWS.md) - State patterns
3. [API_REFERENCE.md](./API_REFERENCE.md) - Available hooks

### "I want to understand the business"
1. [../CONTEXT.md](../CONTEXT.md) §2 - Business strategy
2. [../ROADMAP.md](../ROADMAP.md) - Timeline
3. [../research/10_design_doc_04_platform_and_business.md](../research/10_design_doc_04_platform_and_business.md) - Revenue

---

## 📁 File Structure

```
docs/
├── README.md                    # This file — documentation index
├── API_REFERENCE.md             # Hook & component API docs
├── ARCHITECTURE_FLOWS.md        # Data flows & state management
├── AI_DEVELOPER_GUIDE.md        # AI modification system
├── LM_STUDIO_SETUP.md          # LM Studio configuration
└── QUICKSTART_LM_STUDIO.md     # 3-minute AI setup

../
├── CONTEXT.md                   # Master project context
├── DESIGN.md                    # System architecture
├── ROADMAP.md                   # Development roadmap
├── USER_EXPERIENCE_MAP.md       # User journey
├── MEETING_PREP.md             # Stakeholder notes
├── IP_ASSIGNMENT.md            # IP terms
└── Gamifying Guitar Learning... # Academic research

../mcp-server/
└── README.md                    # MCP server documentation

../research/
├── 10_MASTER_DESIGN_DOC.md
├── 10_design_doc_01_foundation.md
├── 10_design_doc_02_curriculum.md
├── 10_design_doc_03_vertiscale_game.md
└── 10_design_doc_04_platform_and_business.md
```

---

## 🔄 Maintenance

**Rule: Update docs when you change the code.**

If you modify:
- **Game mechanics** → Update `10_design_doc_03_vertiscale_game.md`
- **APIs/Hooks** → Update `API_REFERENCE.md`
- **Architecture** → Update `DESIGN.md`
- **Data flows** → Update `ARCHITECTURE_FLOWS.md`
- **AI features** → Update `AI_DEVELOPER_GUIDE.md`
- **Setup process** → Update `QUICKSTART_LM_STUDIO.md`

---

## 🔍 Quick Search

| Term | Relevant Docs |
|------|---------------|
| useLMStudio | API_REFERENCE.md, DESIGN.md §5 |
| AIDeveloperChat | AI_DEVELOPER_GUIDE.md, API_REFERENCE.md |
| MCP Server | mcp-server/README.md, AI_DEVELOPER_GUIDE.md §MCP |
| State management | ARCHITECTURE_FLOWS.md §2, DESIGN.md §3 |
| Pitch detection | API_REFERENCE.md §usePitchDetector |
| LM Studio | LM_STUDIO_SETUP.md, QUICKSTART_LM_STUDIO.md |
| Vertiscale Engine | 10_design_doc_03_vertiscale_game.md |
| Revenue | CONTEXT.md §2, ROADMAP.md §Revenue |
| i18n | API_REFERENCE.md §useLocale |
| Deployment | DESIGN.md §9 |

---

**Last Updated:** 2026-05-25  
**Maintained by:** Voix Vive Development Team
