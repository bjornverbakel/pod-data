# Pod Data

This is a completion checklist app for **NieR: Automata**, available at [poddata.net](https://poddata.net).

## Technologies

- **Framework**: [Nuxt 4](https://nuxt.com)
- **Database & Authentication**: [Supabase](https://supabase.com)
- **UI Library**: [Vuetify](https://vuetifyjs.com)

## Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Fill in the `.env` file with your own enviroment variables:

   ```env
   SUPABASE_PROJECT_ID="your_supabase_project_id"
   SUPABASE_URL="your_supabase_url"
   SUPABASE_KEY="your_supabase_key"

   TURNSTILE_SITEKEY="your_turnstile_site_key"
   TURNSTILE_SECRET_KEY="your_turnstile_secret_key"
   ```

3. **Run Development Server**:

   ```bash
   pnpm dev
   ```

More instructions can be found [here](/docs/CHEATSHEET.md).

## Resources & Acknowledgements

- [FextraLife NieR: Automata Wiki](https://nierautomata.wiki.fextralife.com/Nier+Automata+Wiki) - Data & guides
- [Fandom NieR: Automata Wiki](https://nier.fandom.com/wiki/NieR:Automata) - Data
- [Steam Community: 100% Guide to NieR:Automata™](https://steamcommunity.com/sharedfiles/filedetails/?id=1690393671) - Data

NieR: Automata is © Square Enix and PlatinumGames. This app is an independent project and is not affiliated with or endorsed by the original creators.

## License

[MIT](LICENSE)
