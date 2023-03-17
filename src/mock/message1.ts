export const message1 = `syntax = "proto3";

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

message GetMovieByGenreIdsRequest {
    repeated int64 genere_ids=1;
    common.OffsetPaginationRequest page = 2;
}

message GetMovieByGenreIdsResponse {
    repeated common.Movie movies =1;
    int64 total_count = 2;
    repeated common.Genre wanted_genres=3;
}

message GetMovieGroupByGenreResponse {
    message GenreMovieGroup {
        common.Genre genre= 1;
        repeated int64 movie_ids=2;
    }
    repeated GenreMovieGroup genre_movie_groups=1;
    repeated common.Movie wanted_movies=2;
}

message GetBasicStatisticResponse {

    int64 movie_draft_count=1;
    int64 movie_inspecting_count=2;
    int64 movie_approved_count=3;
    int64 movie_rejected_count=4;
    int64 movie_deleted_count=5;
    int64 series_count=6;
    int64 franchise_count=7;

}

message GetMovieDetailRequest {
    repeated int64 movie_ids = 1;
    optional common.MovieState state=2;
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

message ListScheduleCastResponse {
    message ScheduleCast {
        int64 cast_id                   = 1;
        common.MultiLingualString title = 2;
    }
    repeated ScheduleCast schedule_cast = 1;
}

message ListMovieTypesResponse {
    message MovieType {
        int64 movie_type_id             = 1;
        bool is_series                  = 2;
        common.MultiLingualString title = 3;
    }
    repeated MovieType types = 1;
}

message ListAdaptedTypesResponse {
    message AdaptedType {
        int64 adapted_type_id           = 1;
        common.MultiLingualString title = 2;
    }

    repeated AdaptedType types = 1;
}

message GetGenreRequest {
    int64 genre_id = 1;
}

message GetGenreResponse {
    int64 genre_id                  = 1;
    common.MultiLingualString title = 2;
}

message ListGenresResponse {
    message Genre {
        int64 genre_id                  = 1;
        common.MultiLingualString title = 2;
    }
    repeated Genre genres = 2;
}

message GetMovieRequest {
    int64 movie_id = 1;
}

message GetMovieResponse {
    message Series {
        int64 season_id      = 1;
        int32 episode_no     = 2;
        bool is_last_episode = 3;
        int64 movie_type_id  = 4;
    }

    message Franchise {
        int64 franchise_id = 1;
    }

    int64 movie_id      = 1;
    optional int64 movie_type_id = 2;

    oneof specific {
        Series series       = 3;
        Franchise franchise = 4;
    }

    // common
    common.MultiLingualString title = 5;
    bool is_coming_soon             = 6;
    // int32 produced_year             = 7; removed in favor of range date
    int64 release_at          = 8;

    repeated int64 genre_ids                            = 11;
    optional common.MultiLingualString plot               = 12;
    optional string production_country                   = 13;

    optional string filming_location                      = 15;
    optional int64 production_start_date = 16;
    optional int64 production_end_date = 17;
    optional int64 visible_at = 18;
    optional int64 available_at = 19;
    repeated int64 age_group_ids = 20; 
    common.MovieState state = 21; 
    common.LikeDetails like_details = 22;
    common.PlaylistDetails playlist_details = 23;
    optional string state_change_reason=24;
    bool is_play_free             = 25;
    bool is_download_free         = 26;
    common.MultiLingualString criticism             = 27;
    double imdb         = 28;
    
}

message ListMoviesRequest {
    enum RequestType {
        REQUEST_TYPE_OTHER     = 0;  // request_id aint used
        REQUEST_TYPE_SEASON    = 1;  // request_id as season_id
        REQUEST_TYPE_FRANCHISE = 2;  // request_id as franchise_id
    }

    RequestType request_type  = 1;
    optional int64 request_id = 2;
    optional common.MovieState state      = 3;
    optional string search_title = 4;
}

message ListMoviesResponse {
    message Movie {
        int64 movie_id      = 1;
        optional int64 movie_type_id = 2;
        // series
        optional int64 season_id    = 3;
        optional int32 episode_no   = 4;
        optional int64 franchise_id = 5;

        optional bool is_last_episode = 6;
        // movie
        // common
        common.MultiLingualString title = 7;
        bool is_coming_soon             = 8;
        // int32 produced_year             = 9; removed in favor of range date
        int64 release_at          = 10;

        optional common.MultiLingualString plot              = 13;
        optional string production_country                   = 14;
        optional string filming_location                      = 15;
        optional int64 production_start_date = 16;
        optional int64 production_end_date = 17;
        optional int64 visible_at = 18;
        optional int64 available_at = 19;
        repeated int64 age_group_ids = 20; 
        repeated int64 genre_ids  = 21;
        common.MovieState state = 22; 
        common.LikeDetails like_details = 23;
        common.PlaylistDetails playlist_details = 24;
        optional string state_change_reason=25;
        bool is_play_free             = 26;
        bool is_download_free         = 27;
        common.MultiLingualString criticism             = 28;
        double imdb         = 29;
    }
    repeated Movie movies = 1;
}


message GetFranchiseRequest {
    int64 franchise_id = 1;
}

message GetFranchiseResponse {
    common.Franchise franchise      =4;
    common.PlaylistDetails playlist_details = 3;
}

message ListFranchisesRequest {
    optional string search_title = 2 ;
    common.OffsetPaginationRequest page = 3;
}

message ListFranchisesResponse {
    message FranchiseInfo {
        common.Franchise franchise                     = 5;
        common.PlaylistDetails playlist_details = 3;
        int64 movie_count = 4;
    }

    repeated FranchiseInfo franchises = 1;
    int64 total_count=2;
}

message GetSeriesRequest {
    int64 series_id = 1;
}

message GetSeriesResponse {
    int64 series_id                                     = 1;
    common.MultiLingualString title                     = 2;
    optional int64 schedule_cast_id                     = 3;
    optional int64 schedule_cast_at = 4;
    int64 movie_type_id = 5;
    common.PlaylistDetails playlist_details = 6;
}


message ListSeriesRequest {
    optional string search_title = 2 ;
    common.OffsetPaginationRequest page = 3;
}

message ListSeriesResponse {
    message SeriesInfo {
       common.Series series=8;
       common.PlaylistDetails playlist_details = 6;
       int64 movie_count = 7;
    }
    repeated SeriesInfo series = 1;
    int64 total_count = 2;
}

message GetSeasonRequest {
    int64 season_id = 1;
}

message GetSeasonResponse {
    int64 season_id                                     = 1;
    int64 series_id                                     = 2;
    int64 season_no                                     = 3;
    common.MultiLingualString title                     = 4;
}

message ListSeasonsRequest {
    int64 series_id = 1;
}

message ListSeasonsResponse {
    message Season {
        int64 season_id                                     = 1;
        int64 series_id                                     = 2;
        int64 season_no                                     = 3;
        common.MultiLingualString title                     = 4;
    }

    repeated Season seasons = 1;
}


message AdminListSeasonsRequest {
    int64 series_id = 1;
    common.MovieState state      = 2;
    optional string searchTitle = 3;
}

message AdminListSeasonsResponse {
    message Season {
        int64 season_id                                     = 1;
        int64 series_id                                     = 2;
        int64 season_no                                     = 3;
        common.MultiLingualString title                     = 4;
        int64 movie_count = 5;
    }

    repeated Season seasons = 1;
}

message ListAdaptedRequest {
    int64 movie_id = 1;
}

message ListAdaptedResponse {
    message Adapted {
        int64 adapted_id                        = 1;
        optional int64 adapted_of_movie_id      = 2;
        int64 type_id                           = 3;
        common.MultiLingualString title         = 4;
        optional string url                     = 5;
        optional common.MultiLingualString desc = 6;
    }
    repeated Adapted adapted = 1;
}

message AdminListHintRequest {
    int64 movie_id = 1;
}

message AdminListHintResponse {
    message Hint {
        int64 hint_id       = 1;
        int64 movie_id      = 2;
        int64 hint_movie_id = 3;
        string description = 4;
    }
    repeated Hint hints = 1;
}

message ListHintRequest {
    int64 movie_id = 1;
}

message ListHintResponse {
    message Hint {
        common.MultiLingualString hint_movie_title                     = 1;
        int64 hint_movie_id = 2;
        string description = 3;
    }
    common.MultiLingualString movie_title                     = 1;
    repeated Hint hints = 2;
}

message GetCastRequest {
    int64 movie_id = 1;
}

message GetCastResponse {
    repeated common.Cast casts=1;
}

message ListCastTypeResponse {
    repeated common.CastType cast_types=1;
}
 

message GetCastDetailRequest {
    int64 movie_id = 1;
}

message GetCastDetailResponse {
    repeated common.CastDetail casts=1;
}


message ListMoviesLikeResponse {
    message Movie {
        int64 movie_id      = 1;
        common.MultiLingualString title = 2;
        optional int64 season_id    = 3;
        optional int32 episode_no   = 4;
        optional int64 franchise_id = 5;
        int64 release_at          = 6;
        repeated int64 age_group_ids = 7; 
        repeated int64 genre_ids  = 8;
        common.MovieState state = 9; 
    }
    repeated Movie movies = 1;
}
`;
