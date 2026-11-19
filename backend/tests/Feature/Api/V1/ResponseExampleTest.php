<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ResponseExampleTest extends TestCase
{
    use RefreshDatabase;

    // Non-numeric ID rejection (route-level validation)
    public function test_the_route_rejects_a_non_numeric_id(): void
    {
        $this->getJson('/api/v1/examples/abc')
            ->assertNotFound(); // is HTTP status 404 Not Found.
    }

    // Default include value (is basic?)
    public function test_it_uses_the_default_include_value(): void
    {
        $this->getJson('/api/v1/examples/10')
            ->assertOk()
            ->assertJsonPath('data.include','basic'); // is HTTP status 404 Not Found.
    }

    // 404 response format 
    public function test_it_returns_a_consistent_not_found_response():void 
    {
        $this->getJson('/api/v1/examples/999')
        ->assertNotFound()
        ->assertJson([
            "success"=>false,
            "message"=>"Example resource was not found.",
            "data"=>null,
            "errors"=>[
                'id'=>["No example exists with ID 999."]
            ]
        ]);
    }

    // Success Response , is return X-Request-ID header (request tracking)
    public function test_it_returns_a_successful_example_reponse():void 
    {
        $response = $this->withHeaders([
            'Accept' => 'application/json', // for JSON response 
            'X-Request-ID' => 'test-request-1001'   // request tracking 
        ])->getJson('api/v1/examples/70?include=summary');

        $response->assertOk()   // is HTTP status code 200 
        ->assertJson([
            "success"=> true,
            "message"=> "Example resource retrieved successfully.",
            "data"=> [
                "id"=> 70,
                "include"=> "summary",
                "request_id"=> "test-request-1001"
            ]
        ])
        ->assertJsonMissingPath('error'); // make sure of it. it's say there is no error field 
    }


    // Create (201)
    public function test_it_creates_an_example_with_status_201():void 
    {
        $this->postJson('/api/v1/examples')
        ->assertCreated()  // is return HTTP status 201 
        ->assertJsonPath('success',true)
        ->assertJsonPath('data.id',101);
    }

}

// php artisan make:test Api/V1/ResponseExampleTest

// php artisan test 

// php artisan test --filter=ResponseExampleTest 


// 2TS 
