export const message2 = `syntax = "proto3";

package movie.v1.qry;

import "common/types_common_v1.proto";
import "google/protobuf/empty.proto";


option go_package = "api/pb/v1/qrypb";

service ClassificationApi {
  // Classifications
  rpc GetClassification(GetClassificationRequest) returns (GetClassificationResponse);
  rpc ListClassifications(google.protobuf.Empty) returns (ListClassificationsResponse);
  rpc GetClassifiedMovies(google.protobuf.Empty) returns (GetClassifiedMoviesResponse);

}

message GetClassificationRequest {
  int64 classification_id = 1; 
}

message GetClassificationResponse {
  common.ClassificationDetail classification=1;
  repeated common.AgeGroup wanted_age_groups=2;
  repeated common.Scenes wanted_scenes=3;
  repeated common.Festival wanted_festivals=4;
  repeated common.FestivalEvent wanted_festival_events=5;
  repeated common.Genre wanted_genres=6;
}

message ListClassificationsResponse {
  repeated common.ClassificationDetail classifications=1;
}

message GetClassifiedMoviesResponse {
  message MovieList {
    common.ClassificationList classification_list =1;
    repeated common.Movie movies=2;
  }
  common.Classification classifications=1;
  repeated MovieList movie_lists=2;
  repeated common.Genre wanted_genres=3; 
  repeated common.Movie slider_movies=4;
}
`;
