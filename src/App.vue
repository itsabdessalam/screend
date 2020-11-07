<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<script>
import { Default as Layout } from "@/layouts";

import { mapGetters } from "vuex";

export default {
  components: {
    Layout
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "sessionId",
      "accountId",
      "isWatchlistInitialized"
    ])
  },
  created() {
    if (this.isAuthenticated && !this.isWatchlistInitialized) {
      this.$store.dispatch("getWatchlist", {
        sessionId: this.sessionId,
        accountId: this.accountId
      });
    }
  }
};
</script>
