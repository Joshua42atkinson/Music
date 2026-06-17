# Voix Vive — Data Privacy & Compliance

> **Status:** DRAFT — Requires legal review
>
> **Last Updated:** 2026-06-03

## Regulatory Context

- **FERPA** (Family Educational Rights and Privacy Act): Applicable because Voix Vive
  is used in an academic practicum context (Purdue EDCI 57300)
- **GDPR**: Applicable for any EU-based students (platform is accessible internationally)
- **COPPA**: NOT applicable (target audience is adult learners)

## Data Collected

| Data Type | Storage Location | Retention |
|-----------|-----------------|----------|
| Email/name (Google OAuth) | Supabase auth | Account lifetime |
| Practice progress | Supabase + localStorage | Account lifetime |
| Journal entries | Supabase + Google Drive | Account lifetime |
| Video submissions | Student's Google Drive | Student-controlled |
| Pitch detection audio | Browser only (not stored) | Session only |
| Paralinguistic events | Supabase | Account lifetime |
| Subscription tier | Supabase user_metadata | Account lifetime |

## Key Principles

1. **Data Sovereignty**: Student practice data lives in THEIR Google Drive
2. **Minimal Collection**: Audio is processed in-browser, never sent to server
3. **Right to Deletion**: Students can request full data deletion
4. **No Third-Party Sharing**: Data is never sold or shared with advertisers
5. **Transparency**: Students can export all their data at any time

## FERPA Compliance Actions

- [ ] Obtain informed consent from students before data collection
- [ ] Implement data export functionality
- [ ] Implement account deletion workflow
- [ ] Document all third-party processors (Supabase, Google Drive, Stripe)
- [ ] Annual security review of access controls
- [ ] Designate a Data Privacy Officer

## Technical Safeguards

- Row Level Security (RLS) on all Supabase tables
- OAuth2 authentication (no password storage)
- HTTPS enforced on all endpoints
- Audio processed client-side only (WebAudio API)
- Google Drive files owned by student's account
