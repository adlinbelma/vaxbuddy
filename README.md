# VaxBuddy 💉

A beautiful, mobile-first vaccine tracking app for children. Built with React and Supabase, VaxBuddy helps parents stay on top of their child's vaccination schedule with the IAP (Indian Academy of Pediatrics) guidelines.

**Live Demo:** https://vaxbuddy-green.vercel.app  
**GitHub:** https://github.com/adlinbelma/vaxbuddy

## Features

✨ **Key Features:**
- 📱 **Mobile-First Design** - Works perfectly on phones, tablets, and desktops
- 🔐 **Secure Authentication** - Email/password signup and login with Supabase
- 💾 **Cloud Sync** - All data synced across devices
- 📸 **Photo Uploads** - Add profile photos for each child
- 📅 **Smart Scheduling** - Automatic due date calculation based on age
- 🔔 **Notifications** - Get reminded about upcoming vaccines
- ✏️ **Custom Vaccines** - Add custom vaccines beyond the IAP schedule
- 📊 **Progress Tracking** - Visual progress bars and completion stats
- 🎉 **Celebration Animations** - Confetti effects when marking vaccines as done
- 🌙 **Beautiful UI** - Gradient design with intuitive interactions

## Tech Stack

- **Frontend:** React 18 (via CDN)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Vercel
- **Styling:** Inline CSS
- **Icons:** Emoji

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Safari, Firefox, Edge)
- Internet connection
- No installation required!

### Usage

1. **Visit the app:** https://vaxbuddy-green.vercel.app
2. **Sign up** with your email and password
3. **Add a child** with their name and date of birth
4. **Track vaccines** and mark them as done when given
5. **View progress** with completion stats and reminders

### On Mobile
- **iOS:** Open Safari → Visit URL → Share → Add to Home Screen
- **Android:** Open Chrome → Visit URL → Menu (⋮) → Install app

## Deployment

### Deploy Your Own (Free)

1. **Clone this repository**
   ```bash
   git clone https://github.com/adlinbelma/vaxbuddy.git
   cd vaxbuddy
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import the cloned repository
   - Deploy (one-click setup)

3. **Set up Supabase:**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Go to Project Settings → API Keys
   - Copy the Project URL and Anon Key
   - Update these in `index.html` (lines 34-37)

4. **Enable Auth & Storage:**
   - In Supabase, go to Authentication → Providers
   - Enable Email (already enabled by default)
   - Create storage bucket named "photos" for profile pictures

## Database Schema

VaxBuddy uses two main tables:

### profiles
```sql
id: uuid
user_id: uuid (foreign key to auth.users)
name: text
dob: date
avatar: text (emoji)
photo_url: text (storage path)
created_at: timestamp
```

### vaccines
```sql
id: uuid
profile_id: uuid (foreign key)
user_id: uuid
name: text
due_date: date
done: boolean
done_date: date (nullable)
notes: text
age_months: numeric (nullable)
custom: boolean
reminder_set: boolean
created_at: timestamp
```

## Development

### Local Setup (for customization)

1. Clone the repository:
   ```bash
   git clone https://github.com/adlinbelma/vaxbuddy.git
   cd vaxbuddy
   ```

2. Open `index.html` in your browser (or use a local server):
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```

3. Make changes and test locally

4. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## IAP Schedule

The app includes the **Indian Academy of Pediatrics (IAP)** recommended vaccination schedule for children from birth to 18 years, including:

- BCG, Hepatitis B, OPV
- DTP + Hib + IPV
- Rotavirus, PCV
- MMR, Varicella
- Typhoid Conjugate, Hepatitis A
- HPV, Meningococcal (MCV4), Tdap
- Influenza (annual)

## Features in Detail

### Authentication
- Secure password hashing with Supabase Auth
- Email verification required
- Automatic session management
- "Forgot password" support

### Offline Support
- Continues to work offline (read-only)
- Syncs when connection restored
- Local data migration from browser storage

### Data Privacy
- All data encrypted in transit (HTTPS)
- Photos stored securely in Supabase Storage
- User data isolated by user_id
- No third-party tracking

## Contributing

Contributions are welcome! Here's how to help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Ideas for Contributions
- Additional vaccine schedules (WHO, CDC guidelines)
- Multi-language support
- Dark mode
- Doctor notes/records
- Health metrics tracking
- Export to PDF
- Print-friendly view
- Parent collaboration features

## Roadmap

- [ ] Multi-language support (Hindi, Tamil, Telugu, etc.)
- [ ] Alternative vaccine schedules
- [ ] Doctor integration
- [ ] Health records storage
- [ ] Parent collaboration (shared profiles)
- [ ] SMS/Email reminders
- [ ] Export functionality
- [ ] Dark mode

## Troubleshooting

### "Please confirm your email"
- Check your inbox (and spam folder) for confirmation email
- Click the confirmation link
- Use "Resend confirmation email" button if needed

### "Photo upload failed"
- Ensure file is under 5MB
- Supported formats: JPG, PNG, WebP, HEIC
- Check internet connection

### "Data not syncing"
- Check internet connection
- Verify you're logged in
- Try refreshing the page
- Check browser console for errors

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: adlinbelma97@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/adlinbelma/vaxbuddy/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/adlinbelma/vaxbuddy/discussions)
- 🌐 Website: https://vaxbuddy-green.vercel.app

## Acknowledgments

- IAP (Indian Academy of Pediatrics) for vaccination guidelines
- Supabase for backend infrastructure
- Vercel for hosting
- React community for amazing tools
- Everyone who uses VaxBuddy to keep their children healthy! ❤️

---

**Made with ❤️ for parents who care about their children's health.**

*Last updated: May 2026*
