import { Transform } from "class-transformer";
import {
	IsBoolean, IsIn, IsInt, IsOptional, IsPositive, IsString,
	Max, MaxLength, Min, MinLength,
} from "class-validator";

import { StayPriceSegment } from "./@types/stays.enums.js";

export class QueryStaysDto {
	/* --- Full Text Search --- */
	// @ApiPropertyOptional({
	// 	description: "Partial text search across indexed fields (name, city, country)",
	// 	example: "Grand Paris Hotel",
	// })
	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly text?: string;

	/* --- Exact Filtering (Common & Discriminator Fields) --- */
	// @ApiPropertyOptional({
	// 	description: "Filter by name (exact match). Only available on StayProfile.",
	// 	example: "The Grand Hotel",
	// })
	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly name?: string;

	// @ApiPropertyOptional({
	// 	description: "Filter by city name (exact match).",
	// 	example: "Paris",
	// })
	@MaxLength(150)
	@MinLength(1)
	@IsOptional()
	@IsString()
	public readonly city?: string;

	// @ApiPropertyOptional({
	// 	description: "Filter by country name (exact match). Only available on StayProfile.",
	// 	example: "France",
	// })
	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly country?: string;

	// @ApiPropertyOptional({
	// 	description: "Filter by price segment (high, medium, low). Only available on StaySummary.",
	// 	example: "high",
	// })
	// @IsEnum(StayPriceSegment)
	@IsIn(Object.values(StayPriceSegment))
	@IsString()
	@IsOptional()
	public readonly priceSegment?: "low" | "medium" | "high";

	// @ApiPropertyOptional({
	// 	description: "Filter by availability status.",
	// 	type: Boolean,
	// 	example: true,
	// })
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }: { value: any }): any => {
		if (value === "true" || value === "1") {
			return true;
		}

		if (value === "false" || value === "0") {
			return false;
		}

		return value;
	})
	public readonly isAvailable?: boolean;

	/* --- Numeric Range Filtering (PricePerNight) --- */
	// @ApiPropertyOptional({
	// 	description: "Minimum price per night (inclusive).",
	// 	type: Number,
	// 	example: 100,
	// })
	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly minPrice?: number;

	// @ApiPropertyOptional({
	// 	description: "Maximum price per night (inclusive).",
	// 	type: Number,
	// 	example: 500,
	// })
	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly maxPrice?: number;

	/* --- Pagination and Sorting --- */
	// @ApiPropertyOptional({
	// 	description: "The number of documents to skip (for pagination).",
	// 	type: Number,
	// 	default: 0,
	// 	example: 10,
	// })
	@Min(0)
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly skip: number = 0;

	// @ApiPropertyOptional({
	// 	description: "The maximum number of documents to return (max 100).",
	// 	type: Number,
	// 	default: 25,
	// 	example: 50,
	// })
	@Max(100)
	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly limit: number = 25;

	// @ApiPropertyOptional({
	// 	description: "Field to sort by (e.g., 'pricePerNight').",
	// 	example: "pricePerNight",
	// })
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly sortBy?: string = "pricePerNight";

	// @ApiPropertyOptional({
	// 	description: "Sort direction ('asc' or 'desc').",
	// 	example: "desc",
	// })
	@IsIn(["ASC", "DESC"])
	@IsString()
	@IsOptional()
	public readonly sortDirection?: "ASC" | "DESC" = "ASC";
}
