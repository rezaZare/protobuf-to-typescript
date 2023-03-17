export const message3 = `syntax = "proto3";

package movie.v1.qry;

import "common/types_common_v1.proto";
import "google/protobuf/empty.proto";

option go_package = "api/pb/v1/qrypb";


service MovieApi {
    //admin
    rpc ListScheduleCast(google.protobuf.Empty) returns (ListScheduleCastResponse);
    rpc ListAdapted(ListAdaptedRequest) returns (ListAdaptedResponse);
    rpc ListAdaptedTypes(google.protobuf.Empty) returns (ListAdaptedTypesResponse);
    rpc GetBasicStatistic(google.protobuf.Empty) returns (GetBasicStatisticResponse);
    rpc ListFranchises(ListFranchisesRequest) returns (ListFranchisesResponse);
    rpc ListSeries(ListSeriesRequest) returns (ListSeriesResponse);

    rpc AdminListSeasons(AdminListSeasonsRequest) returns (AdminListSeasonsResponse);
    rpc AdminListHint(AdminListHintRequest) returns (AdminListHintResponse);

    //client
    rpc ListSeasons(ListSeasonsRequest) returns (ListSeasonsResponse);
    rpc GetMovieDetail(GetMovieDetailRequest) returns (GetMovieDetailResponse);
    rpc GetCastDetail(GetCastDetailRequest) returns (GetCastDetailResponse);
    rpc ListMoviesLike(google.protobuf.Empty) returns (ListMoviesLikeResponse);
    rpc GetMovieLikeDetails(common.Id) returns (common.LikeDetails);
    rpc ListHint(ListHintRequest) returns (ListHintResponse);
    //both
    rpc ListMovies(ListMoviesRequest) returns (ListMoviesResponse);// client -> get series & episode
    rpc ListMovieTypes(google.protobuf.Empty) returns (ListMovieTypesResponse);
    rpc ListGenres(google.protobuf.Empty) returns (ListGenresResponse);

    //ask
    rpc GetGenre(GetGenreRequest) returns (GetGenreResponse);
    rpc GetMovie(GetMovieRequest) returns (GetMovieResponse);

    rpc GetFranchise(GetFranchiseRequest) returns (GetFranchiseResponse);

    rpc GetSeries(GetSeriesRequest) returns (GetSeriesResponse);

    rpc GetSeason(GetSeasonRequest) returns (GetSeasonResponse);

    rpc ListCastType(google.protobuf.Empty) returns (ListCastTypeResponse);
    rpc GetCast(GetCastRequest) returns (GetCastResponse);

    rpc GetMovieGroupByGenre(google.protobuf.Empty)  returns (GetMovieGroupByGenreResponse);
    rpc GetMovieByGenreIds(GetMovieByGenreIdsRequest)  returns (GetMovieByGenreIdsResponse);

}

message GetMovieDetailResponse{
    message MovieDetail {
    message Genre {
        int64 genre_id                  = 1;
        common.MultiLingualString title = 2;
    }
    message MovieType {
        int64 movie_type_id                        = 1;
        common.MultiLingualString   title          = 2;
    }
    message ScheduleCast{
        int64 schedule_cast_Id                              = 1;
        common.MultiLingualString title                     = 2;
    }

    message Episode {
        int64 movie_id =1;
        int64 image_id =2;
        common.MultiLingualString title                     = 3;
        int32 episode_no=4;
    }
    message Season {
        int64 series_id                                     = 1;
        int32 season_no                                     = 2;
        common.MultiLingualString title                     = 3;
        repeated Episode episodes                           = 6;
    }
    message SeriesInfo {

        int64 series_id                                     = 1;
        common.MultiLingualString title                     = 2;
        optional ScheduleCast schedule_cast                 = 3;
        optional int64 schedule_cast_at = 4;
        repeated Season seasons=5;

        // Current episode detail
        int64 current_season_id      = 6;
        int32 current_episode_no     = 7;
        bool is_last_episode = 8;

        MovieType movie_type = 9;
        
    }
    message Franchise {
        int64 franchise_id                        = 1;
        common.MultiLingualString franchise_title = 2;
    }

    message Scene {
        int64 scene_id = 1;
        common.MultiLingualString title = 2;
    }

    message AgeGroup {
        int64 age_group_id = 1;
        int32 from = 2;
        int32 to = 3;
    }

  

    message Hint {
        int64 hint_id = 1;
        int64 hint_movie_id      = 2;
        string description = 3;
        common.MultiLingualString hint_movie_title = 4;
    }


     message Adapted {
        int64 adapted_id                       = 1;
        int64 adapted_type_id = 2;
        common.MultiLingualString title = 3;
        string url = 4;
        common.MultiLingualString description = 5;
        int64 adapted_of_movie_id = 6;
        common.MultiLingualString adapted_type_title = 7;
        common.MultiLingualString adapted_of_movie_title = 8;
     }
    

    message Content {
        message Dialect {
            int64 dialect_id =1;
            string language =  2;
            string title =     3;
          }

        message Subtitle {
          int64 subtitle_id = 1;
          int64 subtitle_file_id = 3;
          int64 content_id = 4;
          bool is_close_caption =5;
          Dialect dialect =6;

        }
        message Audio {
            int64 audio_id = 1;
            int64 audio_file_id = 3;
            int64 content_id = 4;
            bool has_visual_description=5;
            Dialect dialect =6;
        }
        int64 content_id = 1;
        string video_file_id = 2;
        repeated Scene scenes = 3;
        int32 age_restricted = 4;
        common.ContentTypes type_id = 6;
        repeated Audio audios = 7;
        repeated Subtitle subtitles = 8;
        repeated common.MetaContent meta_contents=9;
        common.ContentState state                   = 10;
    }

    oneof specific {
          SeriesInfo series_info = 1;
          Franchise franchise  = 2;
    }

    optional MovieType movie_type = 3;
   
    int64 movie_id                                      = 5;
    common.MultiLingualString title                     = 6;
    bool is_coming_soon                                 = 7;
    int64 release_at                = 9;

    repeated Genre genres = 12;
    repeated common.CastDetail casts = 13;
    repeated common.FestivalEventParticipationDetail festival_event_participations=14;
    repeated Content contents=15;
    optional common.MultiLingualString plot               = 16;
    optional string production_country                   = 17;

    optional string filming_location                      = 18;
    optional int64 production_start_date = 19;
    optional int64 production_end_date = 20;
    optional int64 visible_at = 21;
    optional int64 available_at = 22;
    repeated AgeGroup age_groups = 23; 
    common.MovieState state = 24; 
    common.LikeDetails like_details = 25;
    common.PlaylistDetails playlist_details = 26;
    optional string state_change_reason=27;
    bool is_play_free             = 28;
    bool is_download_free         = 29;
    common.MultiLingualString criticism             = 30;
    double imdb         = 31;
    repeated Hint hints = 32;
    repeated Adapted adapteds = 33;
    }

    repeated MovieDetail movie_details=1;
}

`;
