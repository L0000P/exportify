import i18n from "../../i18n/config"
import TracksData from "./TracksData"
import { apiCall } from "helpers"

class TracksBaseData extends TracksData {
  playlist: any

  constructor(accessToken: string, playlist: any) {
    super(accessToken)
    this.playlist = playlist
  }

  dataLabels() {
    return [
      i18n.t("track.track_uri"),
      i18n.t("track.track_name"),
      i18n.t("track.artist_uris"),
      i18n.t("track.artist_names"),
      i18n.t("track.album_uri"),
      i18n.t("track.album_name"),
      i18n.t("track.album_artist_uris"),
      i18n.t("track.album_artist_names"),
      i18n.t("track.album_release_date"),
      i18n.t("track.album_image_url"),
      i18n.t("track.disc_number"),
      i18n.t("track.track_number"),
      i18n.t("track.track_duration"),
      i18n.t("track.track_preview_url"),
      i18n.t("track.explicit"),
      i18n.t("track.popularity"),
      i18n.t("track.isrc")
    ]
  }

  async trackItems() {
    await this.getPlaylistItems()

    return this.playlistItems
  }

  async data(): Promise<Map<string, string[]>> {
    const trackData = new Map<string, string[]>();

    for (const item of this.playlistItems) {
        const track = item.track;

        // Extract required fields
        const song = track.name;
        const artist: string = track.artists.map((artist: { name: string }) => artist.name).join(" & "); // Join artist names
        const popularity = track.popularity.toString();
        const duration_ms = track.duration_ms.toString();
        const album_type = track.album.album_type;
        const total_tracks = track.album.total_tracks.toString();
        const release_date = track.album.release_date;
        const is_explicit = track.explicit ? "True" : "False";
        const album_cover_url = track.album.images[0]?.url || "";

        // Add data to Map
        trackData.set(track.uri, [song, artist, popularity, duration_ms, album_type, total_tracks, release_date, is_explicit, album_cover_url]);
    }

    return trackData;
  }

  // Memoization supporting multiple calls
  private playlistItems: any[] = []
  private async getPlaylistItems() {
    if (this.playlistItems.length > 0) {
      return this.playlistItems
    }

    var requests = []
    var limit = this.playlist.tracks.limit ? 50 : 100

    for (var offset = 0; offset < this.playlist.tracks.total; offset = offset + limit) {
      requests.push(`${this.playlist.tracks.href.split('?')[0]}?offset=${offset}&limit=${limit}`)
    }

    const trackPromises = requests.map(request => { return apiCall(request, this.accessToken) })
    const trackResponses = await Promise.all(trackPromises)

    this.playlistItems = trackResponses.flatMap(response => {
      return response.data.items.filter((i: any) => i.track) // Exclude null track attributes
    })
  }
}

export default TracksBaseData
